var expect  = require('chai').expect;
var request = require('request');

it('Feedback content', function(done) {
    request('http://localhost:3000/feedback' , function(error, res, body) {
        expect(body).to.exist;
        done();
    });
});