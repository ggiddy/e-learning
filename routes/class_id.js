/* global module */

var express = require('express');
var router = express.Router();
var Class = require('../models/class');

/**
 * This module returns the class id when provided with the class code
 */
module.exports = function(){
   router.post('/', function(req, res){
       Class.findOne({class_code: req.body.class_code}, function(err, the_class){
           if(err){
               return res.status(500).send(err);
           }
           return res.json(the_class._id);
       });
   }); 
   
   return router;
};