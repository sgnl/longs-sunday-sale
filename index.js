
'use strict';
const express = require('express');
const app = express();

const env = process.env.ENVIRONMENT || 'DEVELOPMENT'

if (env === 'DEVELOPMENT') {
  app.use(express.static('./public'));
}

app.post('/newsletter/sub', (req, res) => {
  console.log('new enrollee!');
});

app.post('/newsletter/unsub', (req, res) => {
  console.log('unsub!');
});

app.listen(3001);