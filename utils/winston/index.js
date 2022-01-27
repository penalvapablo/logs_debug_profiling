const winston = require('winston');
const LEVEL = Symbol.for('level');

/**
 * Log only the messages the match `level`.
 */
function filterOnly(level) {
  return winston.format(function (info) {
    if (info[LEVEL] === level) {
      return info;
    }
  })();
}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
    }),
    new winston.transports.File({ 
      filename: 'logs/warn.log', 
      level: 'warn',
      format: filterOnly('warn'), 
    }),
  ],
});

module.exports = logger;