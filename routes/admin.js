/* global module */

//node modules
var express = require('express');
var router = express.Router();

//other files
var access = require('./access_middleware');
var auth = require('./authenticate');

//models
var Student = require('../models/student');
var Admin = require('../models/admin');
var Instructor = require('../models/instructor');
var Expert = require('../models/expert');
var Class = require('../models/class');

//middleware to confirm it is admin calling these routes
router.use(access);

//only admin can create, delete, edit classes
module.exports = function(){
    
    router.route('/class')
            //route to create a new class
            .post(function(req, res){
               var new_class = new Class();
               new_class.class_name = req.body.class_name;
               new_class.class_code = req.body.class_code;
               new_class.instructor = req.body.instructor;
               new_class.class_venue = req.body.class_venue;
               new_class.class_time = req.body.class_time;
               new_class.class_duration = req.body.class_duration;
               
               new_class.save(function(err){
                   if(err){
                       return res.send(err);
                   }
                   return res.json({
                       success: true, 
                       message: 'Class ' + new_class.class_code + ': ' + new_class.class_name + ' successfully added'});
               });
            })
            
            //router to get all available classes
            .get(function(req, res){
                Class.find({}, function(err, classes){
                    if(err){
                        return res.send(err);
                    }
                    return res.json(classes);
                });
            });
    
    router.route("/class/:id")

        //return a specific class
        .get(function(req, res){
            Class.findById(req.params.id, function(err, the_class){
                if(err){
                    return res.send(err);
                }
                
                return res.json(the_class);
            });
        })

        //modify specified post
        .put(function(req, res){
            Class.findById(req.params.id, function(err, the_class){
                if(err){
                    return res.status(500).send(err);
                }
                the_class.class_name = req.body.class_name;
                the_class.class_code = req.body.class_code;
                the_class.instructor = req.body.instructor;
                the_class.class_venue = req.body.class_venue;
                the_class.class_time = req.body.class_time;
                the_class.class_duration = req.body.class_duration;

                the_class.save(function(err, modified_class){
                    if(err){
                        return res.status(500).send(err);
                    }
                    
                    return res.json(modified_class);
                });
            });
        })
        
        //delete specified class
        .delete(function(req, res){
            Class.remove({_id: req.params.id}, function(err){
                if(err){
                    return res.status(500).send(err);
                }
                
                return res.json({success: true, message: 'Successfully deleted class'});
            });
        });
        
    //This route signs up an instructor to the system
    router.post('/instructor/signup', function(req, res) {
    var instructor = new Instructor();
        instructor.first_name = req.body.first_name;
        instructor.last_name = req.body.last_name;
        instructor.password = auth.createHash(req.body.password);
        instructor.email_address = req.body.email_address.toLowerCase();
        instructor.user_type = req.body.user_type;
        instructor.classes_taught = req.body.classes_taught;
        instructor.faculty = req.body.faculty;

        var token = auth.createToken(instructor);

        instructor.save(function(err){
            if(err){
                return res.send(err);
            }
            return res.json({
                success: true, 
                message: 'New instructor: ' +instructor.email_address + ' has been created.', 
                token: token
            });
        });
    });


    /**
     * Routes to fetch registered users from the system.
     */


    //This route fetches all the students in the system
    router.get('/students', function(req, res){
        Student.find({}, function(err, students){
           if(err){
               return res.send(err);
           } 
           return res.json(students);
        });
    });

    //This route fetches all the admins in the system
    router.get('/admins', function(req, res){
        Admin.find({}, function(err, admins){
           if(err){
               return res.send(err);
           } 
           return res.json(admins);
        });
    });

    //This route fetches all the admins in the system
    router.get('/instructors', function(req, res){
        Instructor.find({}, function(err, instructors){
           if(err){
               return res.send(err);
           } 
           return res.json(instructors);
        });
    });

    //This route fetches all the experts in the system
    router.get('/experts', function(req, res){
        Expert.find({}, function(err, experts){
           if(err){
               return res.send(err);
           } 
           return res.json(experts);
        });
    });    
    
    
    return router; 
};