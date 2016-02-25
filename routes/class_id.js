/* global module */

var express = require('express');
var router = express.Router();
var Class = require('../models/class');

/**
 * This module returns the class when supplied with the class id
 */
module.exports = function(){
   router.get('/', function(req, res){
       console.log(req.body);
       
   }); 
   
   return router;
};