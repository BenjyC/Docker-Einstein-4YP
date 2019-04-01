const assert = require('assert');
const path = require('path');

module.exports = {
  
  'Test file upload' : function(browser) {
      browser
        .url("http://localhost:3000")
        .waitForElementVisible('body', 1000)
        .waitForElementVisible('input[name=upload]', 1000)
        .pause(1000)
        .setValue('input[name=upload]', path.resolve(__dirname + '/testfile.txt'))
        .click('input[type=submit]')
        .pause(3000)
        .assert.path.exists(__dirname + '../uploads/testfile.txt')
        .end();
  }
};

  