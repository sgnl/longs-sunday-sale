
'use strict';
const got = require('got');
const mongoose = require('mongoose');

const CONFIG = require('./config/');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = global.Promise;

const Brochure = mongoose.model('Brochure', {url: String});

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

function addNewBrochureToDatabase(response) {
  if (response.statusCode === 200) {
    const newBrochure = {url: newBrochureURL};

    Brochure.findOneAndUpdate(newBrochure, newBrochure, {upsert: true, new: true})
      .then(doc => {
        console.log('success: ', doc);
      });
  }
}

// :sparkles:
got(newBrochureURL)
  .then(addNewBrochureToDatabase)
  .catch(err => {
    console.log(err.response.status);
  });
