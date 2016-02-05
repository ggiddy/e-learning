/* global module */

var express = require('express');
var router = express.Router();
var access = require('./access_middleware');
var Student = require('../models/student');
var auth = require('./authenticate');

//middleware to confirm it is student calling these routes
router.use(access);

module.exports = function(){
    
    //route to edit profile
    router.route('/profile/:id')
            .patch(function(req, res){
                Student.findById(req.params.id, function(err, student){
                    if(err){
                        return res.status(500).send(err);
                    }
                    
                    student.password = createHash(req.body.password);
                    student.save(function(err){
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
    router.patch('/add_classes/:stud_id', function(req, res){
        Student.findById(req.params.stud_id, function(err, student){
            if(err){
                return res.status(500).send(err);
            }
            
            student.classes_taken.push(req.body.class_id);
            
            student.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                        
                return res.send({
                    success: true,
                    message: 'Successfully added class'
                });
            });
        });
    });
    
    //router to remove classes taught
    router.patch('/remove_class/:stud_id', function(req, res){
        Student.findById(req.params.stud_id, function(err, student){
            if(err){
                return res.status(500).send(err);
            }
            
            student.classes_taken.remove(req.body.class_id);

            student.save(function(err){
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