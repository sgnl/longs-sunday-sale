
'use strict';

/* eslint camelcase: "off" */

const path = require('path');
const SendGrid = require('sendgrid');
const { compileFile } = require('pug');

const logger = require('./logger');

const SendGridService = SendGrid(process.env.SENDGRID_API_KEY);

const welcomeEmailTemplate = compileFile(path.resolve(__dirname, '../views/newsletter/welcome-email.pug'));

const addRecipientToSubscriptionList = id => {
  logger.info('moving new recipient email to subscription list on sendgrid service');

  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: `/v3/contactdb/lists/787187/recipients/${id}`
  });

  return SendGridService.API(request)
    .then(response => {
      logger.info('success moving email to subscription list');
      return response;
    });
};

const addNewSubscription = newSubscription => {
  logger.info('adding new recipient email to sendgrid service');
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: '/v3/contactdb/recipients',
    body: [
      {
        email: newSubscription
      }
    ]
  });

  return SendGridService.API(request)
    .then(response => {
      logger.info('success adding new recipient email');
      return response;
    });
};

const sendConfirmationEmail = (email, brochures) => {
  logger.info('sending confirmation email');

  const welcomeEmailHTML = welcomeEmailTemplate({ brochures });

  console.log('welcomeEmailHTML: ', welcomeEmailHTML);

  // const request = SendGridService.emptyRequest({
  //   method: 'POST',
  //   path: '/v3/mail/send',
  //   body: {
  //     personalizations: [
  //       {
  //         to: [
  //           {
  //             email: 'rayrfarias@gmail.com'
  //           }
  //         ]
  //       }
  //     ],
  //     from: {
  //       email: 'sundaysalenewsletter@gmail.com',
  //       name: 'Sunday Sale Newsletter'
  //     },
  //     subject: 'welcome',
  //     content: [
  //       {
  //         type: 'text/html',
  //         value: welcomeEmailHTML
  //       }
  //     ]
  //   }
  // });

  // return SendGridService.API(request)
  //   .then(response => {
  //     logger.info('success sending confirmation email');
  //     return response;
  //   });
};

module.exports = {
  addNewSubscription,
  addRecipientToSubscriptionList,
  sendConfirmationEmail
};
