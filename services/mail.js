
'use strict';
/* eslint new-cap: "off" */

const SendGrid = require('sendgrid');
const CONFIG = require('../config/');
const MongoService = require('./mongo');

const SendGridService = SendGrid(CONFIG.SENDGRID.API_KEY);

function getEmailsAndSendNewsletter() {
  return new Promise((resolve, reject) => {
    getAllEmails()
      .then(sendNewsletter)
      .catch(reject);
  });
}

function getAllEmails() {
  return new Promise((resolve, reject) => {
    const request = sg.emptyRequest({
      method: 'GET',
      path: '/v3/contactdb/lists/783410/recipients?page_size=100'
    });
    sg.API(request)
      .then(response => resolve(response.body.recipients.map(recep => recep.email)))
      .catch(err => reject(err));
  });
}

function sendNewsletter(emails) {
  sg.API(createNewsletter(emails))
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(err => {
      console.log(err.response.statusCode);
    });
}

function createNewsletter(/* emails */) {
  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              // email: 'exampleuser@example.com'
            }
          ],
          subject: '{{name}}, Here is your Longs sunday sale PDF, delivered!'
        }
      ],
      from: {
        email: 'longs-sunday-sale@gmail.com'
      },
      content: [
        {
          type: 'text/html',
          value: 'Sunday sale at <a href="{{url}}">this link</a>.'
        }
      ]
    }
  });
}

function send(toSend) {
  console.log(JSON.stringify(toSend, null, 2));

  const requestBody = toSend;
  const emptyRequest = sg.request;
  const requestPost = JSON.parse(JSON.stringify(emptyRequest));
  requestPost.method = 'POST';
  requestPost.path = '/v3/mail/send';
  requestPost.body = requestBody;
  sg.API(requestPost, (error, response) => {
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