const productTestController = require('../components/productTest/ProductTestController');
const UsersRegistro = require('../components/users/UsersRegistro');
const UsersLogin = require('../components/users/UsersLogin');
const isLoggedIn = require('../utils/isLoggedIn');
const authenticateToken = require('../utils/authenticateToken')
const info = require('../components/info')
const apiRandom = require('../components/api-randoms')
const logger = require('../utils/winston')

let user = ''

module.exports = (app) => {
  productTestController(app);
  UsersRegistro(app);
  UsersLogin(app)
  info(app)
  apiRandom(app)
  
  app.get('/auth', authenticateToken, (req, res) => {
    user = req.user
    res.send('usuario validado');
  });

  app.get('/', (req,res)=>{
    if (user === '') {
      return res.redirect('login')
    } 
    res.render('index', { mail: user[0].mail })
  })
  app.get('/logout', (req, res) => {

    res.render('logout');
  });

  app.get('*', (req, res)=>{
    logger.log('warn', `ruta inexistente`)
    res.status(404).json({
      error: -2,
      description: `ruta ${req.originalUrl} método get no implementado`,
    })
  })
};
