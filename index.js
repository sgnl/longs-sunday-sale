
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const MongoService = require('./services/mongo');

const app = express();

const env = process.env.ENVIRONMENT || 'DEVELOPMENT';

app.set('view engine', 'pug');
app.set('views', './views');

// otherwise nginx will serve static files in production
if (env === 'DEVELOPMENT') {
  app.use(express.static('./public'));
}

app.use(bodyParser.json({extended: true}));

app.get('/', (req, res) => {
  MongoService.findMostRecentUrls()
    .then(brochures => res.render('index', {brochures}))
    .catch(err => res.send(err));
});

function validatePayloadOrQueryParams(req, res, next) {
  if (req.method === 'POST' && !{}.hasOwnProperty.call(req.body, 'email')) {
    return res.status(422).send('nope.');
  } else if (req.method === 'GET' && !{}.hasOwnProperty.call(req.query, 'email')) {
    return res.status(422).send('nope.');
  }
  return next();
}

app.post('/newsletter/sub', validatePayloadOrQueryParams, (req, res) => {
  MongoService.addNewSubscription(req.body.email)
    .then(() => {
      res.send('added to the list.');
    })
    // .then(MailService.sendConfirmationEmail)
    .catch(err => {
      console.error('error saving new subscription email ', err);
      res.status(500);
    });
});

// change to get with query params for ez-unsub via email link
app.post('/newsletter/unsub', validatePayloadOrQueryParams, (req, res) => {
  MongoService.removeSubscription(req.body.email)
    .then(email => {
      res.send(`${email} has been removed from the mailing list. aloha.`);
    })
    .catch(err => {
      console.error('error removing subscription ', err);
      res.status(500);
    });
});

app.use('*', (_, res) => {
  res.send('lolwut?');
});

app.listen(3001);