
'use strict';
const mongoose = require('mongoose');
const Subscription = mongoose.model('Subscription', {email: String});

module.exports = Subscription;
