/* global module */

var express = require('express');
var router = express.Router();
var async = require('async');
var access = require('./access_middleware')();
var Instructor = require('../models/instructor');
var auth = require('./authenticate');
var Class = require('../models/class');
var Messages = require('../models/messages');

//middleware to confirm it is instructor calling these routes
router.use('/access', access);

module.exports = function(io){

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
                
                var to_teach = [];
                async.each(req.body.selections, 
                    function(the_class, callback){
                        Class.findById(the_class, function(err, result){
                            to_teach.push(result);
                            callback();
                        });
                    }, 
                    function(err){
                        if(err){
                            return res.status(500).send(err);
                        }

                        //emit event so that the class is added in real time
                        io.emit(req.params.lec_id, to_teach);

                        return res.json({success: true, message: 'Successfully added classes'});
                }); 
            });
        });
    });
    
    //router to remove classes taught
    router.patch('/remove_classes/:id', function(req, res){
        Instructor.findById(req.params.id, function(err, instructor){
            if(err){
                return res.status(500).send(err);
            }
            
            //loop though the selections array and remove each of its contents from the database
            for(var i=0; i<req.body.selections.length; i++){
                if(instructor.classes_taught.indexOf(req.body.selections[i]) !== -1){
                    instructor.classes_taught.remove(req.body.selections[i]);
                }  
            }

            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                Instructor.findById(req.params.id).select('classes_taught').exec(function(err, inst){
                    if(err){
                        return res.status(500).send(err);
                    }

                    var removed = [];
                    async.each(inst.classes_taught, 
                    function(the_class, callback){
                        Class.findById(the_class, function(err, result){
                            removed.push(result);
                            callback();
                        });
                    }, 
                    function(err){
                        if(err){
                            return res.status(500).send(err);
                        }
                        
                        //emit event so that the class is added in real time
                        var remevent = req.params.id + 'remove';
                        io.emit(remevent, removed);

                        return res.json({success: true, message: 'Successfully removed classes'});
                    }); 
                })
                
            });
        });
    });
    
    //router to return all classes taught given the instructor's id
    router.get('/get_classes/:id', function(req, res){
        
        Instructor.findById(req.params.id).select('classes_taught').exec(function(err, inst){ 
            var taught = [];
            var items = inst['classes_taught'];
            async.each(items, function(item, callback){
                Class.findById(item, function(err, result){
                    taught.push(result);
                    callback(); 
                });
            }, function(err){
                if(err){
                    return res.sendStatus(500).send(err);
                }
                return res.json(taught);
            });
        });
    });
    
    //route to send and receive messages
    router.get('/messages/:id', function(req, res){
        Messages.find({class_id: req.params.id}, function(err, messages){
            if(err){
                return res.status(500).send(err);
            }
             
            return res.json(messages);
        });
    });

    router.post('/messages/:id', function(req, res){
        var msg = new Messages();

        msg.message = req.body.message;
        msg.sender = req.body.sender;
        msg.class_id = req.params.id;
        msg.created_at = Date.now();
        
        msg.save(function(err, message){
            if(err){
                return res.status(500).send(err);
            }

            io.emit(req.params.id, message);
            
            return res.json({success: true, message: 'Successfully sent'});
        });
    });

    return router;
};