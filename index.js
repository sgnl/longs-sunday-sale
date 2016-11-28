
'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoService = require('./services/mongo');

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
    .then(urls => res.render('index', {urls}))
    .catch(err => res.send(err));
});

app.post('/newsletter/sub', (req, res) => {
  if (!req.body.hasOwnProperty('email')) {

    return res.status(422).send('nope.');
  } else {
    MongoService.addNewSubscription(req.body.email)
      .then(_ => {
        res.send('added to the list.');
      })
      .catch(err => {
        console.error('error saving new subscription email', err);
      });
  }
});

app.post('/newsletter/unsub', (req, res) => {
  console.log('unsub!');
});

app.use('*', (_, res) => {
  res.send('lolwut?');
})

app.listen(3001);
