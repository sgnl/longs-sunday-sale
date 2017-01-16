
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const logger = require('./logger');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);
mongoose.Promise = Promise;

const {Brochure, Subscription} = require('../models');

function findMostRecentUrls() {
  // TODO make more robust?
  return Brochure.find({});
}

// TODO change to add sub via sendgrid api
function addNewSubscription(email) {
  return new Promise((resolve, reject) => {
    const newSubscription = {email};

    Subscription.findOneAndUpdate(newSubscription, newSubscription, upsertOptions)
      .then(() => resolve(email))
      .catch(err => {
        // => TODO: alert me!
        console.log('something went wrong saving subscription to db!: ', err);
        reject(err);
      });
  });
}

module.exports = {
  findMostRecentUrls/*,
  addNewSubscription*/
};
