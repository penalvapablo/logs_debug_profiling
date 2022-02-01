const express = require('express');
const moment = require('moment');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const cors = require('cors');
const { config } = require('./config');
const serverRoutes = require('./routes');
const chatController = require('./components/chat/ChatController');
const normalizar = require('./normalizr');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongodb } = require('./config');
const { yargObj } = require('./utils/yargs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression')
const logger = require('./utils/winston')
// Initializations
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Middlewares
app.use(cors(`${config.cors}`));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongodb.conexion,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'coderhouse',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000,
    },
    rolling: true,
  })
);

// Rutas
serverRoutes(app);

/* SOCKETS */
io.on('connection', async (socket) => {
  logger.log('info', 'nuevo cliente conectado');
  // socket.emit('products', products);

  socket.emit('messages', normalizar(await chatController.listAll()));

  // socket.on('productAdd', async (data) => {
  //   const { title, price, thumbnail } = data;
  //   await inventory.addProduct(title, price, thumbnail);
  //   const productos = await inventory.getProducts();
  //   io.sockets.emit('products', productos);
  // });

  socket.on('message', async (message) => {
    const { author, text } = message;
    const newMessage = {
      author,
      text,
      fecha: moment(new Date()).format('DD/MM/YYY HH:mm:ss'),
    };
    await chatController.save({
      author: newMessage.author,
      text: newMessage.text,
      fecha: newMessage.fecha,
    });
    io.sockets.emit('message', newMessage);
  });
});
/* SOCKETS */

const PORT = process.argv[2] || process.env.PORT || yargObj.port ;

const mode = process.argv[3]?.toUpperCase() || yargObj.mode.toUpperCase();



if (mode === 'FORK') {
  const server = httpServer.listen(PORT, () => {
    logger.log(
      'info', 
      `Servidor inicializado en el puerto ${server.address().port} con pid ${process.pid}.`
    );
  });

  server.on('error', (err) => {
    logger.log('error', 'Error del servidor.' + err);
  });
  process.on('exit', (code) => {
    ogger.log('info', 'Exit code -> ' + code)
  });
}
if (mode === 'CLUSTER') {
  if (cluster.isMaster) {
    console.log(`Master -> PID: ${process.pid}`);

    // Workers
    console.log('cpus..', numCPUs);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      logger.log('warn', `worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    const server = httpServer.listen(PORT, () => {
      logger.log(
        'info',
        `Servidor inicializado en el puerto ${server.address().port} con pid ${process.pid}.`
      );
    });

    server.on('error', (err) => {
      logger.log('error', 'Error del servidor.' + err)
      // console.log(e);
    });
    process.on('exit', (code) => {
      logger.log('info', 'Exit code -> ' + code)
    });
  }
}
