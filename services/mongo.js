
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const CONFIG = require('../config/');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = Promise;

const { Brochure, Subscription } = require('../models');
const upsertOptions = {upsert: true, new: true};

function addNewBrochureUrl(url) {
  return new Promise((resolve, reject) => {
    const newBrochure = {url};

    Brochure.findOneAndUpdate(newBrochure, newBrochure, upsertOptions)
      .then(_ => resolve(url))
      .catch(err => {
        // => TODO: alert me!
        console.log('something went wrong saving brochure to db!: ', err);
        reject(err);
      });
  });
}

function findMostRecentUrls() {
  return new Promise((resolve, reject) => {
    Brochure.find({})
      .then(brochures => resolve(brochures.map(b => b.url)))
      .catch(err => {
        console.log('something went wrong retrieving MostRecentUrls');
        reject(err);
      })
  });
}

function addNewSubscription(email) {
  return new Promise((resolve, reject) => {
    const newSubscription = {email};

    Subscription.findOneAndUpdate(newSubscription, newSubscription, upsertOptions)
      .then(_ => resolve(email))
      .catch(err => {
        // => TODO: alert me!
        console.log('something went wrong saving subscription to db!: ', err);
        reject(err);
      })
  });
}

module.exports = {
  addNewBrochureUrl,
  findMostRecentUrls,
  addNewSubscription
};
