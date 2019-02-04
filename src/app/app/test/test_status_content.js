var expect  = require('chai').expect;
var request = require('request');


describe('Status and Content', function() {
	describe('Upload page', function() {
		it('status', function(done){
			request('http://localhost:3000' , function(err, res, body) {
        		expect(res.statusCode).to.equal(200);
        		done();
       		});
		});

		it('content', function(done) {
			request('http://localhost:3000' , function(error, res, body) {
        		expect(body).to.contain("Docker Einstein upload page");
        		done();
        	});
		});

	});

	describe('Feedback page', function() {
		it('status', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('content', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(body).to.contain('Upload feedback page');
				done();
			});
		});
	});
});