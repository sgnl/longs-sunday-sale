
'use strict';

/* eslint
  camelcase: "off"
*/

const mongoose = require('mongoose');
const Promise = require('bluebird');

const { Brochure } = require('../models');
const logger = require('./logger');

mongoose.Promise = Promise;
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);

const getRecentBrochures = () => {
  logger.info('retrieving recent brochure');
  return Brochure.find({}).sort({ created_at: -1 }).limit(5);
};

module.exports = { getRecentBrochures };

