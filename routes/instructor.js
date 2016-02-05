/* global module */

var express = require('express');
var router = express.Router();
var access = require('./access_middleware');
var Instructor = require('../models/instructor');
var auth = require('./authenticate');

//middleware to confirm it is instructor calling these routes
router.use(access);

module.exports = function(){
    
    //route to edit profile
    router.route('/profile/:id')
            .patch(function(req, res){
                Instructor.findById(req.params.id, function(err, instructor){
                    if(err){
                        return res.status(500).send(err);
                    }
                    
                    instructor.password = req.body.password;
                    
                    instructor.save(function(err){
                        if(err){
                            return res.status(500).send(err);
                        }
                        
                        return res.send({
                            success: true,
                            message: 'Successfully updated profile'
                        });
                    });
                });
            });
            
    //router to only add classes taught
    router.patch('/add_classes/:lec_id', function(req, res){
        Instructor.findById(req.params.lec_id, function(err, instructor){
            if(err){
                return res.status(500).send(err);
            }
            
            instructor.classes_taught.push(req.body.class_id);
            
            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                        
                return res.send({
                    success: true,
                    message: 'Successfully added classes'
                });
            });
        });
    });
    
    //router to remove classes taught
    router.patch('/remove_class/:id', function(req, res){
        Instructor.findById(req.params.id, function(err, instructor){
            if(err){
                return res.status(500).send(err);
            }
            
            instructor.classes_taught.remove(req.body.class_id);

            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                        
                return res.send({
                    success: true,
                    message: 'Successfully removed class'
                });
            });
        });
    });
    return router;
};