
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const CONFIG = require('../config/');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = Promise;

const { Brochure, Subscription } = require('../models');

function addNewBrochureUrl(url) {
  return new Promise((resolve, reject) => {
    const newBrochure = {url};

    Brochure.findOneAndUpdate(newBrochure, newBrochure, {upsert: true, new: true})
      .then(_ => resolve(url))
      .catch(err => {
        // => TODO: alert me!
        console.log('something went wrong saving to db!: ', err);
      });
  });
}

module.exports = {
  addNewBrochureUrl
};
