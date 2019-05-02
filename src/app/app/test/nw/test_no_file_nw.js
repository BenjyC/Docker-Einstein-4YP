const assert = require('assert');
const path = require('path');

module.exports = {
  
  'Test no file uploaded' : function(browser) {
      browser
        .url("http://localhost:3000")
        .waitForElementVisible('body', 1000)
        .waitForElementVisible('form[id=dz-upload]', 1000)
        .pause(1000)
        .click('input[type=submit]')
        .pause(1000)
        .assert.containsText('#upload', 'No file supplied')
        .end();
  }
};