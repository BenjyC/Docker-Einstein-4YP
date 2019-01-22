var express = require('express');
var formidable = require('formidable');
var router = express.Router();

/* GET feedback page. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'Upload feedback page' });
});

// Handle uploaded file
router.post('/', (req,res) => {
	
	new formidable.IncomingForm().parse(req, (err, fields, files) => {

		if (err) {
	      console.error('Error', err)
	      throw err
	    }
	    console.log('Fields', fields)
	    console.log('Files', files)
	    files.map(file => {
	      console.log(file)
	    })

	/*	.on('fileBegin', (name, file) => {
			form.on('fileBegin', (name, file) => {
				file.path = __dirname + '/uploads' + file.name;
			})
		})

		.on('file', (name, file) => {
			console.log('Uploaded file', name, file);
		})

		.on('error', (err) => {
			console.error('Error', err);
			throw err;
		})*/
	})
})

module.exports = router;
