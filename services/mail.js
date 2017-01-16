
'use strict';
/* eslint new-cap: "off" */

const SendGrid = require('sendgrid');

const CONFIG = require('../config/');
const logger = require('./logger');

const SendGridService = SendGrid(CONFIG.SENDGRID.API_KEY);

function getEmailsAndSendNewsletter({url}) {
  if (!url) throw Error('cannot send newsletter withour brochure url');

  const request = SendGridService.emptyRequest({
    method: 'GET',
    path: '/v3/contactdb/lists/787192/recipients?page_size=1000&page=1'
  });

  logger.info('fetching contacts');

  return SendGridService.API(request)
    .then(response => {
      logger.info('response from sendgrid', response);
      return response.body.recipients.map(recep => recep.email)
    })
    // .then(emails => {
    //   logger.info('preparing for delivery', {count:emails.length});
    //   return emails;
    // })
    .then(createCampaign(url))
    .then(campaignId => activateCampaign(campaignId));
}

function createCampaign(url) {
  return (emails) => {
    logger.info('building new campaign specifications');

    const request = SendGridService.emptyRequest({
      method: 'POST',
      path: '/v3/campaigns',
      body: {
        title: 'YOUR SUNDAY SALE TITLE',
        subject: 'Your Sunday Sale newletter has arrived!',
        sender_id: 98524,
        list_ids: [
          787192
        ],
        suppression_group_id: 1925,
        custom_unsubscribe_url: '',
        html_content: '<html><head><title></title></head><body><p>DA LINK WILL GO HERE</p><a href="[unsubscribe]">Unsubscribe from this newsletter</a></body></html>',
        plain_content: 'DA LINK WILL GO HERE [unsubscribe]'
      }
    });

    return SendGridService.API(request)
      .then(response => {
        logger.info('success creating new campaign', response);
        return response.body.id;
      });
  };
}

function activateCampaign(id) {
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: `/v3/campaigns/${id}/schedules/now`
  });

  logger.info('attempting to active campaign', {id});

  return SendGridService.API(request)
    .then(response => {
      logger.info('success activating campaign', response);
      return process.exit(0);
    });
}

function send(toSend) {
  console.log(JSON.stringify(toSend, null, 2));

  const requestBody = toSend;
  const emptyRequest = SendGridService.request;
  const requestPost = JSON.parse(JSON.stringify(emptyRequest));
  requestPost.method = 'POST';
  requestPost.path = '/v3/mail/send';
  requestPost.body = requestBody;
  SendGridService.API(requestPost, (error, response) => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

module.exports = {
  getEmailsAndSendNewsletter
};

if (process.env.DEBUG) {
  // zebug
  getEmailsAndSendNewsletter()
    .catch(console.error);
}