
'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');

const { Brochure/* , Subscription */ } = require('../models');
const logger = require('./logger');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);
mongoose.Promise = Promise;

function findMostRecentUrls() {
  logger.info('fetching brochures');
  return Brochure.find({}).sort({ created_at: -1 });
}

// change to add sub via sendgrid api
// function addNewSubscription(email) {
//   return new Promise((resolve, reject) => {
//     const newSubscription = { email };

//     Subscription.findOneAndUpdate(newSubscription, newSubscription , upsertOptions )
//       .then(() => resolve(email))
//       .catch(err => {
//         // => TODO: alert me!
//         console.log('something went wrong saving subscription to db!: ', err);
//         reject(err);
//       });
//   });
// }

module.exports = { findMostRecentUrls /* , addNewSubscription */ };
