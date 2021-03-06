const assert = require('assert');
const path = require('path');

module.exports = {
  
  'Test file upload' : function(browser) {
      browser
        .url("http://localhost:3000")
        .waitForElementVisible('body', 1000)
        .waitForElementVisible('form[id=dz-upload]', 1000)
        .pause(1000)
        .execute("document.querySelectorAll('input[type=file]')[0].style.display = 'block';")
        .setValue('input[type=file]', path.resolve(__dirname + '/testfile.txt'))
        .pause(3000)
        .assert.containsText('body', 'Your upload file is: testfile.txt')
        .end();
  }
};

  
