
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const brochureSchema = new Schema({
  url: {required: true, type: String},
  date_added: {
    required: true,
    type: String,
    default: function() {
      return moment().format('MMM Do');
    },
  },
  // clicks: {type: Number, default: 0} TODO
});

const Brochure = mongoose.model('Brochure', brochureSchema);

module.exports = Brochure;
