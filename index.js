
'use strict';
const got = require('got');
const mongoose = require('mongoose');

const CONFIG = require('./config/');

// mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
got(`http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`)
  .then(response => {
    console.log('status code is: ', response.statusCode, ' \\o/ ');
  })
  .catch(err => {
    console.log(err.response.status);
  });
