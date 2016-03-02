/* global module */

var express = require('express');
var router = express.Router();
var async = require('async');
var access = require('./access_middleware')();
var Student = require('../models/student');
var auth = require('./authenticate');
var Class = require('../models/class');

//middleware to confirm it is student calling these routes
router.use('/access', access);

module.exports = function(){
    
    classes_taken = [];
    done = false;
    counter = 0;
    
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
            
    //router to only add classes taken
    router.patch('/add_classes/:id', function(req, res){
        Student.findById(req.params.id, function(err, student){
            if(err){
                return res.status(500).send(err);
            }
            
            //loop though the selections array and add each of its contents to the database
            for(var i=0; i<req.body.selections.length; i++){
                if(student.classes_taken.indexOf(req.body.selections[i]) === -1){
                    student.classes_taken.push(req.body.selections[i]);
                }  
            }
            student.save(function(err){
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
    
    //router to return all classes taken given the student's id
    router.get('/get_classes/:id', function(req, res){
        
        Student.findById(req.params.id).select('classes_taken').exec(function(err, student){ 
            var taken = [];
            var items = student['classes_taken'];
            async.each(items, function(item, callback){
                Class.findById(item, function(err, result){
                    taken.push(result);
                    callback(); 
                });
            }, function(err){
                if(err){
                    return res.sendStatus(500).send(err);
                }
                return res.json(taken);
            });
        });
    });
    
    //route to send and receive messages
    router.route('/messages/:id')
        .get(function(req, res){
             Messages.find({class_id: req.params.id}, function(err, messages){
                 if(err){
                     return res.status(500).send(err);
                 }
                 return res.json(messages);
             });
        })
        .post(function(req, res){
            var msg = new Messages();

            msg.message = req.body.message;
            msg.sender = req.body.sender;
            msg.class_id = req.params.id;
            msg.created_at = Date.now();

            msg.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                return io.emit(req.params.id, msg);
            });
        });
    return router;
};