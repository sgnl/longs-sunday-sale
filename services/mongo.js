
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const CONFIG = require('../config/');
const logger = require('./logger');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = Promise;

const {Brochure, Subscription} = require('../models');

// upserts brochure document and then returns it
function addNewBrochureUrl(url) {
  const newBrochureURLObject = {url};
  const upsertOptions = {upsert: true, new: true};

  logger.info('attempting to upsert new brochure url');

  return Brochure.findOneAndUpdate(newBrochureURLObject, upsertOptions)
    .then(doc => {
      logger.info('brochure document created');
      return doc;
    })
}

function findMostRecentUrls() {
  return new Promise((resolve, reject) => {
    Brochure.find({}).sort({id: -1})
      .then(brochures => resolve(brochures))
      .catch(err => {
        console.log('something went wrong retrieving MostRecentUrls');
        reject(err);
      });
  });
}

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

function removeSubscription(email) {
  return new Promise((resolve, reject) => {
    Subscription.remove(email)
      .then(() => resolve(email))
      .catch(err => reject(err));
  });
}

module.exports = {
  addNewBrochureUrl,
  findMostRecentUrls,
  addNewSubscription,
  removeSubscription
};
