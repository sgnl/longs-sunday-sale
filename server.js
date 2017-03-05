
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const { getRecentBrochure, getAllBrochures } = require('./services/mongo-service');
const { addNewSubscription } = require('./services/sendgrid-service');
const logger = require('./services/logger');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.ENVIRONMENT !== 'TEST') {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true
      })
    ],
    meta: true,
    colorize: true,
    msg: '{{res.statusCode}} {{req.method}} {{req.url}}'
  }));
}

// otherwise nginx will serve static files in production
app.use(express.static('public'));

app.get('/', (req, res) => {
  getRecentBrochure()
    .then(brochures => res.render('index', { brochures }))
    .catch(err => res.send(err));
});

app.get('/previous-longs-cvs-sale-brochures', (req, res) => {
  getAllBrochures()
    .then(brochures => res.render('past', { brochures: brochures.slice(1) }));
});

// add new sub via sendgrid api
app.post('/newsletter/sub', validatePayloadOrQueryParams, (req, res) => {
  logger.info('new subscription request received');

  return addNewSubscription(req.body.email)
    .then(() => res.send('success'))
    // .then(MailService.sendConfirmationEmail)
    .catch(err => {
      console.error('error saving new subscription email ', err);
      res.status(500);
    });
});

app.get('/thank-you', (req, res) => {
  res.render('thank-you');
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

function validatePayloadOrQueryParams(req, res, next) {
  if (req.method === 'POST' && !{}.hasOwnProperty.call(req.body, 'email')) {
    return res.status(422).send('nope.');
  } else if (req.method === 'GET' && !{}.hasOwnProperty.call(req.query, 'email')) {
    return res.status(422).send('nope.');
  }
  return next();
}

module.exports = app;
