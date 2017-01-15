#!/usr/bin/env node

'use strict';
/**
 * This file is meant to be run via crontab only!
 * The cron should run once per week @ 6am HST (16 UTC)
 *
 * DEVELEOPMENT: `npm run cron` will execute just this module
 */

const got = require('got');
const MongoService = require('../services/mongo');

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

// :sparkles:
got(newBrochureURL)
  .then(res => {
    if (res.statusCode === 200) {
      return MongoService.addNewBrochureUrl(newBrochureURL)
        .catch(console.error)
    }
    throw new Error('Status was not 200, instead: ', res.statusCode);
  })
  .then(url => {
    console.log('success! new url: ', url);
    return process.exit(0);
  })
  // .then(getEmailsAndSendNewsletter)
  .catch(console.error);
