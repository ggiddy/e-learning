/* global module */

module.exports = function(io){
    var express = require('express');

    var router = express.Router();

    router.get('/', function(req, res, next){
        return res.render('index', {title: 'User Story'});
    });

    return router;
};
