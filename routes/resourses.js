var express = require('express');
var multer = require('multer');
var router = express.Router();
var Resourse = require('../models/resourses');
var path = require('path');
var fs = require('fs');

var join = path.join;

module.exports = function(dir){
	router.post('/',  multer({dest: './uploads/'}).single('file'), function(req, res, next){

		//save the filename and path to database
		var file = new Resourse();
		file.name = req.file.originalname;
		file.path = req.file.path;

		file.save(function(err){
			if(err){
				return res.status(500).send(err);
			}

			return res.json({success: true, message: 'File has been successfully uploaded'});
		});
	});

	return router;

};