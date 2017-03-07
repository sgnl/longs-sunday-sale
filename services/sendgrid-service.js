
'use strict';

const SendGrid = require('sendgrid');

const logger = require('./logger');

const SendGridService = SendGrid(process.env.SENDGRID_API_KEY);

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
  /* eslint camelcase: "off" */
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

const sendConfirmationEmail = (email, brochure) => {
  // logger.info('sending confirmation email', { email, brochure });
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      template_id: '4317950f-cc88-440a-a540-9edbfe626210',
      personalizations: [
        {
          to: [
            {
              email: 'rayrfarias@gmail.com'
            }
          ],
          substitutions: {
            '-brochure-': brochure.url
          }
        }
      ],
      from: {
        email: 'sundaysalenewsletter@gmail.com',
        name: 'Sunday Sale Newsletter'
      },
      subject: 'welcome',
      content: [
        {
          type: 'text/plain',
          value: 'Hello, Email!'
        }
      ]
    }
  });

  return SendGridService.API(request)
    .then(response => {
      logger.info('success sending confirmation email');
      return response;
    });
};

module.exports = {
  addNewSubscription,
  addRecipientToSubscriptionList,
  sendConfirmationEmail
};
