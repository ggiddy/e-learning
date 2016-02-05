/* global module */

var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var auth = require('./authenticate');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secretKey = config.secretKey;

module.exports = function(req, res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(token){
            jwt.verify(token, secretKey, function(err, decoded){
                if(err){
                    return res.json({success: false, message: 'Failed to authenticate user'});
                }

                req.decoded = decoded;
      
                next();
            });
        } else {
            return res.status(403).send({success: false, message: 'No token provided'});
        }
    };

router.get('/me', function(req, res){
    return res.json(req.decoded);
});

module.exports = router;