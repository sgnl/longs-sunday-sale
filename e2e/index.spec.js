
'use strict';

const chromedriver = require('chromedriver');

const server = require('../server');

server.listen(8181);

module.exports = {
  before: function () {
    chromedriver.start();
  },
  after: function () {
    chromedriver.stop();
  },
  'Demo test Google': function (browser) {
    return browser
      .url('http://localhost:8181/')
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.containsText('header h1', 'long\'s sunday sale');
  }
};
