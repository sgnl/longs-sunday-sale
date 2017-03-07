
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const logger = require('./services/logger');
const { getRecentBrochure, getAllBrochures } = require('./services/mongo-service');
const {
  addNewSubscription,
  addRecipientToSubscriptionList,
  sendConfirmationEmail
} = require('./services/sendgrid-service');

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
  return getRecentBrochure()
    .then(brochures => res.render('index', { brochure: brochures.shift() }))
    .catch(err => res.send(err));
});

app.get('/why', (req, res) => {
  return res.render('why');
});

app.get('/thank-you', (req, res) => {
  return res.render('thank-you');
});

app.get('/previous-longs-cvs-sale-brochures', (req, res) => {
  return getAllBrochures()
    .then(brochures => res.render('past', { brochures: brochures }));
});

// add new sub via sendgrid api
app.post('/newsletter/sub', validatePayloadOrQueryParams, (req, res) => {
  logger.info('new subscription request received');

  return addNewSubscription(req.body.email)
    .then(response => addRecipientToSubscriptionList(response.body.persisted_recipients))
    .then(() => getRecentBrochure())
    .then(brochures => {
      return sendConfirmationEmail(req.body.email, brochures.shift());
    })
    .then(() => res.redirect('/thank-you'))
    .catch(err => {
      console.error('error saving new subscription email ', err);
      res.status(500);
    });
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
