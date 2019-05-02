var expect  = require('chai').expect;
var request = require('request');


describe('Upload Page', function() {
	describe('Navbar', function() {
		it('checks navbar content', function(done){
			request('http://localhost:3000' , function(err, res, body) {
        		expect(body).to.contain('Docker Einstein');
        		done();
       		});
		});
	});

	describe('Body', function() {
		it('checks body content', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(body).to.contain('Upload Page');
				done();
			});
		});

		it('checks DropZone', function(done){
			request('http://localhost:3000/feedback', function(err, res ,body){
				expect(body).to.contain('dropzone');
				done();
			});
		});
	});
});
