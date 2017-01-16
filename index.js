
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const logger = require('./services/logger');
const { findMostRecentUrls } = require('./services/mongo');

const app = express();
const PORT = process.env.PORT;

const env = process.env.ENVIRONMENT;

app.set('view engine', 'pug');
app.set('views', './views');

// otherwise nginx will serve static files in production
app.use(bodyParser.json({extended: true}));
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
app.use(express.static('./public'));

app.get('/', (req, res) => {
  findMostRecentUrls()
    .then(brochures => res.render('index', {brochures}))
    .catch(err => res.send(err));
});

// TODO add new sub via sendgrid api
// app.post('/newsletter/sub', validatePayloadOrQueryParams, (req, res) => {
//   addNewSubscription(req.body.email)
//     .then(() => {
//       res.send('added to the list.');
//     })
//     // .then(MailService.sendConfirmationEmail)
//     .catch(err => {
//       console.error('error saving new subscription email ', err);
//       res.status(500);
//     });
// });

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

app.listen(PORT, () => logger.info(`server started on http://localhost:${PORT}`));
