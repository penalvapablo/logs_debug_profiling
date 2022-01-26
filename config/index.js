require('dotenv').config();
const MONGO_DB = process.env.MONGO_DB_URI


const config = {
  port: process.env.PORT || '8080',
  cors: process.env.CORS || '*',
  email_support: process.env.EMAIL_SUPPORT || '',
  email_error: process.env.EMAIL_ERROR || '',
  node_env: process.env.NODE_ENV !== 'production',
};

const mongodb = {
  conexion: MONGO_DB
};

module.exports = { config, mongodb };
