
'use strict';
const got = require('got');
const MongoService = require('../services/mongo');
let sg = require('sendgrid');

const CONFIG = require('../config/');

sg = sg(CONFIG.SENDGRID.API_KEY);

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

// :sparkles:
got(newBrochureURL)
  .then(res => {
    if (res.statusCode === 200) {
      return MongoService.addNewBrochureUrl(newBrochureURL);
    } else {
      throw new Error('Status was not 200, instead: ', res.statusCode);
    }
  })
  .then(url => {
    console.log('success! new url: ', url);
    return process.exit(0);
  })
  // .then(getEmailsAndSendNewsletter)
  .catch(err => {
    // => TODO: alert me!
    console.log('got catch error: ', err);
  });
