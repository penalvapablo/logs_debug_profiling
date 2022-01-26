const UsersRegistro = require('../components/users/UsersRegistro');
const Users = require('../components/users/UsersSchema')

module.exports = async function isRegistered(req, res, next) {
  const { mail} = req.body
  const exists = await Users.find({mail: mail })
  if (exists.length) {
    res.render('registro-UsuarioRegistrado');
    return;
  }
  next();
};

