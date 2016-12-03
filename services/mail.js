
'use strict';
/* eslint new-cap: "off" */

let sg = require('sendgrid');

const CONFIG = require('../config/');

sg = sg(CONFIG.SENDGRID.API_KEY);

function getAllSubscriptionEmails() {
  return new Promise((resolve, reject) => {
    const request = sg.emptyRequest({
      method: 'GET',
      path: '/v3/contactdb/lists/783410/recipients?page_size=100'
    });

    sg.API(request)
      .then(response => resolve(response.body))
      .catch(err => reject(err));
  });
}

module.exports = {
  getAllSubscriptionEmails
};
