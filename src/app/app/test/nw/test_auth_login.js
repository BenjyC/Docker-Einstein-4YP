const assert = require('assert');
const path = require('path');

module.exports = {
  
  'Test authentication login' : function(browser) {
      browser
        .url("http://localhost:3000")
        .waitForElementVisible('body', 1000)
        .waitForElementVisible('#loginButton', 1000)
        .pause(1000)
        .assert.containsText('h1', 'Authentication')
        .click('#loginButton')
        .waitForElementVisible('body', 1000)
        .pause(3000)
        .assert.containsText('body', 'Upload Page')
        .end();
  }
};
