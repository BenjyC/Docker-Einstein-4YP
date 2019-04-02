var expect  = require('chai').expect;
var request = require('request');


describe('Status and Content', function() {
	describe('Upload page', function() {
		it('checks status', function(done){
			request('http://localhost:3000' , function(err, res, body) {
        		expect(res.statusCode).to.equal(200);
        		done();
       		});
		});

		it('checks content', function(done) {
			request('http://localhost:3000' , function(error, res, body) {
        		expect(body).to.contain("Docker Einstein Upload Page");
        		done();
        	});
		});

	});

	describe('Feedback page', function() {
		it('checks status', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('checks redirect to /', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(body).to.contain('Docker Einstein Upload Page');
				done();
			});
		});
	});
});