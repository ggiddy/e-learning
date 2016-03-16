/* global module */

//node modules
var express = require('express');
var router = express.Router();

//other files
var access = require('./access_middleware')();
var auth = require('./authenticate');

//models
var Student = require('../models/student');
var Admin = require('../models/admin');
var Instructor = require('../models/instructor');
var Expert = require('../models/expert');
var Class = require('../models/class');

//middleware to confirm it is admin calling these routes
router.use('/access', access);

//only admin can create, delete, edit classes
module.exports = function(io){
    
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
               
               new_class.save(function(err, new_cls){
                   if(err){
                       return res.send(err);
                   }

                   //emit event of new class
                   io.emit('newclass', new_cls);

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

        //modify specified class
        .patch(function(req, res){
            Class.findById(req.params.id, function(err, the_class){
                if(err){
                    return res.status(500).send(err);
                }
                console.log(req.body.class_time);
                the_class.class_name = req.body.class_name || the_class.class_name;
                the_class.class_code = req.body.class_code || the_class.class_code;
                the_class.instructor = req.body.instructor || the_class.instructor;
                the_class.class_venue = req.body.class_venue || the_class.class_venue;
                the_class.class_time = req.body.class_time || the_class.class_time;
                the_class.class_duration = req.body.class_duration || the_class.class_duration;

                the_class.save(function(err, modified_class){
                    if(err){
                        return res.status(500).send(err);
                    }
                    
                    io.emit('modifiedclass', modified_class);
                    return res.json({success: false, message: 'Successfully modified class: '+modified_class.class_code});
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
    
    //This route signs up an admin into the database
    router.post('/admin/signup', function(req, res) {
        var admin = new Admin();
        admin.first_name = req.body.first_name;
        admin.last_name = req.body.last_name;
        admin.password = auth.createHash(req.body.password);
        admin.email_address = req.body.email_address.toLowerCase();
        admin.user_type = req.body.user_type;

        admin.save(function(err){
            if(err){
                return res.send(err);
            }
            io.emit('newadmin', admin);
            return res.json({
                success: true, 
                message: 'New admin ' + admin.email_address + ' has been created.', 
            });
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
        instructor.faculty = req.body.faculty;

        instructor.save(function(err){
            if(err){
                return res.send(err);
            }

            //emit event of new instructor
            io.emit('newinstructor', instructor);

            return res.json({
                success: true, 
                message: 'New instructor: ' +instructor.email_address + ' has been created.', 
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
    
    /**
     * Route used to change the password of an administrator
     */
    router.patch('/change_admin_pwd/', function(req, res){
        
        //first select the user with the specified id
        Admin.findById(req.body.admin_id)
        .select('password')
        .exec(function(err, user){
            if(err){
                return res.status(500).send(err);
            }
            
            //Check if old password matches 
            if(!auth.isValidPassword(user, req.body.old_password)){
                 return res.json({success: false, message: 'Old password incorrect'});
            }
            user.password = auth.createHash(req.body.new_password);
            user.save(function(err){
                if(err){
                    return res.send(err);
                }
                return res.json({success: true, message: 'Password successfully updated'});
            }); 
        });
            
    });
     
    //admin
    router.patch('/reset_admin_pwd/:id', function(req, res){
        
        //first select the user with the specified id
        Admin.findById(req.params.id, function(err, admin){
            if(err){
                return res.status(500).send(err);
            }
            
            var temp_password = '*' + admin.first_name.toLowerCase() + '#';
            
            admin.password = auth.createHash(temp_password);
            admin.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                return res.json({success: true, message: 'Successfully reset password'});
            });
        });
    });
  
    
    //instructor
    router.patch('/reset_instructor_pwd/:id', function(req, res){
        
        //first select the user with the specified id
        Instructor.findById(req.params.id, function(err, instructor){
            if(err){
                return res.status(500).send(err);
            }
            
            var temp_password = '*' + instructor.first_name.toLowerCase() + '#';
            
            instructor.password = auth.createHash(temp_password);
            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
            });
            return res.json({success: true, message: 'Successfully reset password'});
        });
    });
    
    //student
    router.patch('/reset_student_pwd/:id', function(req, res){
        
        //first select the user with the specified id
        Student.findById(req.params.id, function(err, student){
            if(err){
                return res.status(500).send(err);
            }
            
            var temp_password = '*' + student.first_name.toLowerCase() + '#';
            
            student.password = auth.createHash(temp_password);
            student.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
            });
            return res.json({success: true, message: 'Successfully reset password'});
        });
    });
    
    //expert
    router.patch('/reset_expert_pwd/:id', function(req, res){
        
        //first select the user with the specified id
        Expert.findById(req.params.id, function(err, expert){
            if(err){
                return res.status(500).send(err);
            }
            
            var temp_password = '*' + expert.first_name.toLowerCase() + '#';
            
            expert.password = auth.createHash(temp_password);
            expert.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
            });
            return res.json({success: true, message: 'Successfully reset password'});
        });
    });
    
    /**
     * Routes to inactivate users' accounts
     */
    
    //Admins
    router.patch('/archive_admin/:id', function(req, res){
        
        //first select the user with the specified id
        Admin.findById(req.params.id, function(err, admin){
            if(err){
                return res.status(500).send(err);
            }
            
            if(req.body.status){
                admin.status = 'Active';
                var message = 'Admin ' + admin.email_address + ' successfully restored';
            } else {
                admin.status = 'Inactive';
                message = 'Admin ' + admin.email_address + ' successfully archived';
            }
            
            admin.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                
                io.emit('archive', admin.status);
                return res.json({
                    success: true, 
                    message: message,
                    status: admin.status
                });
            });
        });
    });

    router.patch('/archive_instructor/:id', function(req, res){
        
        //first select the user with the specified id
        Instructor.findById(req.params.id, function(err, instructor){
            if(err){
                return res.status(500).send(err);
            }
            
            if(req.body.status){
                instructor.status = 'Active';
                var message = 'Instructor ' + instructor.email_address + ' successfully restored';
            } else {
                instructor.status = 'Inactive';
                message = 'Instructor ' + instructor.email_address + ' successfully archived';
            }
            
            instructor.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                
                return res.json({
                    success: true, 
                    message: message,
                    status: instructor.status
                });
            });
        });
    });

    /**
     *Route to activate or deactivate class
     *
     */
     router.patch('/archive_class/:id', function(req, res){
        
        //first select the user with the specified id
        Class.findById(req.params.id, function(err, cls){
            if(err){
                return res.status(500).send(err);
            }
            
            if(req.body.status){
                cls.status = 'Active';
                var message = 'Class ' + cls.class_code + ' successfully restored';
            } else {
                cls.status = 'Inactive';
                message = 'Class ' + cls.class_code + ' successfully archived';
            }
            
            cls.save(function(err){
                if(err){
                    return res.status(500).send(err);
                }
                
                return res.json({
                    success: true, 
                    message: message,
                    status: cls.status
                });
            });
        });
    });
    
    return router; 
};