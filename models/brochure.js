
'use strict';
const mongoose = require('mongoose');
const Brochure = mongoose.model('Brochure', {url: String});

module.exports = Brochure;
