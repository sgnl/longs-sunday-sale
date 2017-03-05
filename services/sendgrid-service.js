
'use strict';

const SendGrid = require('sendgrid');

const logger = require('./logger');

const SendGridService = SendGrid(process.env.SENDGRID_API_KEY);

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
      logger.info('success adding new recipient email', response);
      return addRecipientToSubscriptionList(response.body.persisted_recipients);
    });
};

const addRecipientToSubscriptionList = id => {
    logger.info('moving new recipient email to subscription list on sendgrid service');

    const request = SendGridService.emptyRequest({
      method: 'POST',
      path: `/v3/contactdb/lists/787187/recipients/${id}`
    });

    return SendGridService.API(request)
      .then(resposne => {
        logger.info('success moving email to subscription list');
      });
};

module.exports = { addNewSubscription };
