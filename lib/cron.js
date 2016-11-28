
'use strict';
const got = require('got');
const mongoose = require('mongoose');
let sg = require('sendgrid');

const CONFIG = require('./config/');

sg = sg(CONFIG.SENDGRID.API_KEY);

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = global.Promise;

const Brochure = mongoose.model('Brochure', {url: String});
const Email = mongoose.model('Email', {email: String});

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

function addNewBrochureToDatabase(response) {
  if (response.statusCode === 200) {
    const newBrochure = {url: newBrochureURL};

    return Brochure.findOneAndUpdate(newBrochure, newBrochure, {upsert: true, new: true})
      .catch(err => {
        // => TODO: alert me!
        console.log('something went wrong saving to db!: ', err);
      });
  }
}

function getEmailsAndSendNewsletter({url}) {
  // Email.find({})
}

// :sparkles:
got(newBrochureURL)
  .then(addNewBrochureToDatabase)
  .then(getEmailsAndSendNewsletter)
  .catch(err => {
    // => TODO: alert me!
    console.log('got catch error: ', err);
  });
