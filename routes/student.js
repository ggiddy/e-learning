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

module.exports = function(io){
    
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

                var to_take = [];
                async.each(req.body.selections, 
                    function(the_class, callback){
                        Class.findById(the_class, function(err, result){
                            to_take.push(result);
                            callback();
                        });
                    }, 
                    function(err){
                        if(err){
                            return res.status(500).send(err);
                        }

                        //emit event so that the class is added in real time
                        io.emit(req.params.id, to_take);

                        return res.json({success: true, message: 'Successfully added classes'});
                });
            });
        });
    });
    
    //router to remove classes taken
    router.patch('/remove_classes/:id', function(req, res){
        Student.findById(req.params.id, function(err, student){
            if(err){
                return res.status(500).send(err);
            }
            
            //loop though the selections array and remove each of its contents from the database
            for(var i=0; i<req.body.selections.length; i++){

                //first check to see if the class to be remained_classes exists
                if(student.classes_taken.indexOf(req.body.selections[i]) !== -1){
                    student.classes_taken.remove(req.body.selections[i]);
                }  
            }

            student.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                Student.findById(req.params.id).select('classes_taken').exec(function(err, student){
                    if(err){
                        return res.status(500).send(err);
                    }

                    var remained_classes = [];
                    async.each(student.classes_taken, 
                    function(the_class, callback){
                        Class.findById(the_class, function(err, result){
                            remained_classes.push(result);
                            callback();
                        });
                    }, 
                    function(err){
                        if(err){
                            return res.status(500).send(err);
                        }
                        
                        //emit event so that the class is added in real time
                        var remevent = req.params.id + 'remove';
                        io.emit(remevent, remained_classes);

                        return res.json({success: true, message: 'Successfully removed classes'});
                    }); 
                });
            });
        });
    });
    
    //router to return all classes taken given the student's id
    router.get('/get_classes/:id', function(req, res){
        
        //Query the students model where the id is req.params.id and the student has registered for classes
        Student.find({ $and: [{_id: req.params.id}, { classes_taken: { $exists: true }}]}).exec(function(err, student){ 
            var taken = [];
            
            //first check if the student is taking any classes
            if(student){
                var items = student[0]['classes_taken'];
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
            }
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

        msg.save(function(err){
            if(err){
                return res.status(500).send(err);
            }

            io.emit(req.params.id, msg);
            
            return res.json({success:true, message: 'Successfully sent'}); 
        });
    });
    return router;
};