
'use strict';

/* eslint
  camelcase: "off"
*/

const mongoose = require('mongoose');
const Promise = require('bluebird');

const { Brochure } = require('../models');
// const { addContact } = require('./sendgrid-service');
const logger = require('./logger');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);
mongoose.Promise = Promise;

const getRecentBrochures= () => {
  logger.info('retrieving recent brochure');
  return Brochure.find({}).sort({ created_at: -1 }).limit(5);
};

const getAllBrochures = () => {
  logger.info('retrieving all brochures');
  return Brochure.find({}).sort({ created_at: -1 });
};

module.exports = { getRecentBrochures, getAllBrochures };

