const assert = require('assert');
const path = require('path');

module.exports = {
  
  'Test redirect after upload' : function(browser) {
      browser
        .url("http://localhost:3000")
        .waitForElementVisible('body', 1000)
        .waitForElementVisible('input[type=file]', 1000)
        .pause(1000)
        .setValue('input[type=file]', path.resolve(__dirname + '/testfile.txt'))
        .click('input[type=submit]')
        .pause(3000)
        .assert.containsText('#upload', 'Your upload file is: testfile.txt')
        .click('.btn')
        .waitForElementVisible('body', 1000)
        .assert.containsText('body', 'Docker Einstein Upload Page')
        .end();
  }
};