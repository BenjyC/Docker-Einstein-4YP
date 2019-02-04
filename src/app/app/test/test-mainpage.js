var expect  = require('chai').expect;
var request = require('request');

it('Main page content', function(done) {
    request('http://localhost:3000' , function(error, res, body) {
        expect(body).to.exist;
        done();
    });
});