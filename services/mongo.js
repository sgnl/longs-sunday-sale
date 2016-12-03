
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const CONFIG = require('../config/');

mongoose.connect(`mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.URL}`);
mongoose.Promise = Promise;

const {Brochure, Subscription} = require('../models');

const upsertOptions = {upsert: true, new: true};

function addNewBrochureUrl(url) {
  return new Promise((resolve, reject) => {
    const newBrochureURLObject = {url};

    Brochure.findOneAndUpdate(newBrochureURLObject, upsertOptions)
      .then(doc => {
        if (doc === null) {
          const newBrochure = new Brochure(newBrochureURLObject);

          return newBrochure.save()
            .then(() => resolve(url))
            .catch(err => console.error(err));
        }
        return resolve(`${url} already in database.`);
      })
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
