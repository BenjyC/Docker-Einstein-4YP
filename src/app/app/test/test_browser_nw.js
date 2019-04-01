const assert = require('assert');

module.exports = {

  'Test upload page' : function (browser) {
    browser
      .url("http://localhost:3000")
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('input[name=upload]')
      .waitForElementVisible('input[type=submit]')
      .end();
  }
};