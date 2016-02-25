/* global module */

var express = require('express');
var router = express.Router();
var access = require('./access_middleware')();
var Instructor = require('../models/instructor');
var auth = require('./authenticate');
var Class = require('../models/class');

//middleware to confirm it is instructor calling these routes
router.use('/access', access);

module.exports = function(){
    
    classes_taught = [];
    done = false;
    counter = 0;
    
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
            
            //loop though the selections array and add each of its contents to the database
            for(var i=0; i<req.body.selections.length; i++){
                if(instructor.classes_taught.indexOf(req.body.selections[i]) === -1){
                    instructor.classes_taught.push(req.body.selections[i]);
                }  
            }
            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                        
                return res.json({
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
    
    //router to return all classes taught
    router.get('/get_classes/:id', function(req, res){
        
        Instructor.findById(req.params.id).select('classes_taught').exec(function(err, inst){
            for(var i=0; i<inst['classes_taught'].length; i++){
                
                //for every class_id query the database to get the class itself
                Class.findById(inst['classes_taught'][i]).exec(function(err, class_taught){
                    classes_taught.push(class_taught);  
                });
                counter++;
            }
            if(counter === inst['classes_taught'].length){
                done = true;
            }
            
            if(done){
                return res.json(classes_taught);
            }
            
        });
        
    });
    
    //router to clear the classes_taught array
    router.get('/clear_taught', function(req, res){
        classes_taught = [];
        return;
    });
    return router;
};