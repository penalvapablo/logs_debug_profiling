const jwt = require('jsonwebtoken')
const PRIVATE_KEY = "myprivatekey";

module.exports = function generateToken(user) {
  const token = jwt.sign({ data: user }, PRIVATE_KEY, { expiresIn: '10m' });
  return token;
}