const jwt = require('jsonwebtoken')
require('dotenv').config();
const PRIVATE_KEY = process.env.PRIVATE_KEY_JWT;

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({
      error: 'not authenticated'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'not authorized'
      });
    }

    req.user = decoded.data;
    next();
  }); 
};