#!/usr/bin/env node

'use strict';
/**
 * This file is meant to be run via crontab only!
 * The cron should run once per week @ 6am HST (16 UTC)
 *
 * DEVELEOPMENT: `npm run cron` will execute just this module
 */

const got = require('got');

const { addNewBrochureUrl } = require('../services/mongo');
const { getEmailsAndSendNewsletter } = require('../services/mail');
const logger = require('../services/logger');

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

// :sparkles:
got(newBrochureURL)
  .then(res => {
    if (res.statusCode !== 200) {
      throw new Error('Status was not 200, instead: ', res.statusCode);
    }

    logger.info('success fetching new brochure url', { newBrochureURL });

    return addNewBrochureUrl(newBrochureURL)
  })
  .then(doc => getEmailsAndSendNewsletter(doc))
  .catch(logger.error);
