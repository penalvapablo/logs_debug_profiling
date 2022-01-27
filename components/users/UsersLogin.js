const Users = require('./UsersSchema');
const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/generateToken');
const authenticateToken = require('../../utils/authenticateToken');
const UsersRegistro = require('./UsersRegistro');
const logger = require('../../utils/winston')


module.exports = (app) => {
  app.use('/login', router);

  router.get('/', (req, res) => {
    logger.log('info', `ruta /login, metodo get`);
    res.render('login');
  });

  router.post('/', async (req, res) => {
    logger.log('info', `ruta /login, metodo post`);
    const { mail, password } = req.body;
    if (!mail || !mail.length) {
      res.status(401).send();
      return;
    }
    try {
      const user = await Users.find({ mail: mail });
      const confirmPassword = await bcrypt.compare(password, user[0].password);
      if (!confirmPassword) {
        return res.render('login-error');
      }
      const access_token = generateToken(user);

      res.json({ access_token })
    } catch (error) {
      console.log(error);
    }
  });
};
