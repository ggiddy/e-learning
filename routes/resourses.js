var express = require('express');
var multer = require('multer');
var router = express.Router();
var Resourse = require('../models/resourses');
var path = require('path');
var fs = require('fs');

var join = path.join;

module.exports = function(dir, io){

	//route to upload files to server.
	router.post('/',  multer({dest: './uploads/'}).single('file'), function(req, res, next){
		
		//save the filename and path to database
		var resourse = new Resourse();
		resourse.name = req.file.originalname;
		resourse.uploader = req.body.uploader;
		resourse.path = req.file.path;
		resourse.class_id = req.body.class_id;
		resourse.uploaded_at = Date.now();

		resourse.save(function(err, resourse){
			if(err){
				return res.status(500).send(err);
			}

			io.emit('resourse'+resourse.class_id, resourse);
			return res.json({success: true, message: 'File has been successfully uploaded'});
		});
	});

	//route to get all resourses
	router.get('/:class_id', function(req, res){
		Resourse.find({class_id: req.params.class_id}, function(err, resourses){
			if(err){
				return res.status(500).send(err);
			}
			return res.json(resourses);
		});
	});


	router.get('/uploads/:id', function(req, res) {
		var file = 'uploads/' + req.params.id;
		res.download(file);
	});

	return router;

};