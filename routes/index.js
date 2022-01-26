const productTestController = require('../components/productTest/ProductTestController');
const UsersRegistro = require('../components/users/UsersRegistro');
const UsersLogin = require('../components/users/UsersLogin');
const isLoggedIn = require('../utils/isLoggedIn');
const authenticateToken = require('../utils/authenticateToken')
const info = require('../components/info')
const apiRandom = require('../components/api-randoms')

let user = ''

module.exports = (app) => {
  productTestController(app);
  UsersRegistro(app);
  UsersLogin(app)
  info(app)
  apiRandom(app)
  
  app.get('/auth', authenticateToken, (req, res) => {
    user = req.user
    console.log(user)
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

  app.get('*', (req, res) =>
    res.status(404).json({
      error: -2,
      description: `ruta ${req.originalUrl} método get no implementado`,
    })
  );
};
