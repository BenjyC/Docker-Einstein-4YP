const assert = require('assert');

module.exports = {

  'Test login page' : function (browser) {
    browser
      .url("http://localhost:3000")
      .waitForElementVisible('body', 1000)
      .assert.containsText('h1', 'Authentication')
      .waitForElementVisible('a[id=loginButton]')
      .end();
  }
};