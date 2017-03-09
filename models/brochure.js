
/* eslint
  camelcase: "off"
 */
'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const brochureSchema = new Schema({
  island: { required: true, type: String },
  url: { required: true, type: String },
  date_added: {
    required: true,
    type: String,
    default: () => moment().format('MMM Do YYYY')
  },
  created_at: {
    type: Date,
    default: () => new Date()
  }
});

const Brochure = mongoose.model('Brochure', brochureSchema);

module.exports = Brochure;
