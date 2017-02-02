
'use strict';

const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json: true
    })
  ],
  exitOnError: false
});

if (process.env.ENVIRONMENT === 'test') {
  logger.configure({
    level: 'test',
    transports: []
  });
}

module.exports = logger;
