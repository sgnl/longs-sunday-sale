
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const CONFIG = require('../config/');
const logger = require('./logger');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = Promise;

const {Brochure, Subscription} = require('../models');

function findMostRecentUrls() {
  return new Promise((resolve, reject) => {
    Brochure.find({})
      .then(brochures => {
        console.log('brochures: ', brochures);
        resolve(brochures);
      })
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

module.exports = {
  findMostRecentUrls,
  addNewSubscription
};
