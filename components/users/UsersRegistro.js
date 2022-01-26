const Users = require('./UsersSchema');
const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcrypt');
const isRegistered = require('../../utils/isRegistered')
// const users = await Users.find({mail: 'e@e'});

module.exports = (app) => {
  app.use('/registro', router);

  router.get('/', (req, res) => {
    res.render('registro');
  });

  router.post('/', isRegistered, async (req, res) => {
    try {
      const { mail, password } = req.body;
      if (!mail || !mail.length) {
        res.status(401).json({ error: 'No se envió un nombre para el Login' });
        return;
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        mail: mail,
        password: hashedPassword,
      };
      await Users.create(newUser);
      res.redirect('login');
    } catch (error) {
      console.log(error);
    }
  });
};
