
'use strict';

/* eslint camelcase: "off" */

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const logger = require('./services/logger');
const { getRecentBrochures } = require('./services/mongo-service');
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
  return getRecentBrochures()
    .then(brochures => res.render('index', { brochures, date_added: brochures.concat().shift().date_added }))
    .catch(err => res.send(err));
});

app.post('/newsletter/sub', validatePayloadOrQueryParams, (req, res) => {
  return addNewSubscription(req.body.email)
    .then(response => addRecipientToSubscriptionList(response.body.persisted_recipients))
    .then(() => getRecentBrochures())
    .then(brochures => {
      return sendConfirmationEmail(req.body.email, brochures.shift());
    })
    .then(() => res.redirect('/thank-you'))
    .catch(err => {
      console.error('error saving new subscription email ', err);
      res.status(500);
    });
});

app.get('/why', (req, res) => {
  return res.render('why');
});

app.get('/thank-you', (req, res) => {
  return res.render('thank-you');
});

app.get('/newsletter/welcome-email', (req, res) => {
  return getRecentBrochures()
    .then(brochures => res.render('newsletter/welcome-email', { brochures, date_added: brochures.concat().shift().date_added }))
    .catch(err => res.send(err));
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
