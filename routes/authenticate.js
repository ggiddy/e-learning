/* global module */

//node_modules
var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../config');

//models
var Student = require('../models/student');
var Admin = require('../models/admin');
var Instructor = require('../models/instructor');
var Expert = require('../models/expert');

//custom config files
var secretKey = config.secretKey;

/**
 * Routes to signup new users into the system.
 */


//This route signs up a student to the system
router.post('/student/signup', function(req, res) {
    var student = new Student();
    student.first_name = req.body.first_name;
    student.last_name = req.body.last_name;
    student.password = createHash(req.body.password);
    student.email_address = req.body.email_address.toLowerCase();
    student.user_type = req.body.user_type;
    student.faculty = req.body.faculty;
    student.admission_no = req.body.admission_no.toUpperCase();
    
    
    student.save(function(err){
        if(err){
            return res.send(err);
        }
        return res.json({
            success: true, 
            admission_no: student.admission_no,
            password: req.body.password
        });
    });
});

//This route signs up an expert to the system
router.post('/expert/signup', function(req, res) {
    var expert = new Expert();
    expert.first_name = req.body.first_name;
    expert.last_name = req.body.last_name;
    expert.password = createHash(req.body.password);
    expert.email_address = req.body.email_address.toLowerCase();
    expert.user_type = req.body.user_type;
    expert.specialty = req.body.specialty;
    
    var token = createToken(expert);
    
    expert.save(function(err){
        if(err){
            return res.send(err);
        }
        return res.json({
            success: true, 
            message: 'New expert ' +expert.email_address + ' has been created. Expertise: ' +expert.specialty, 
            token: token
        });
    });
});

/**
 * Routes to login users into the system.
 */

/* This route logs in a student into the system */
router.post('/student/login', function(req,res){
    Student.findOne({admission_no: req.body.admission_no})
            .select('first_name last_name user_type email_address admission_no password status')
            .exec(function(err, student){
        if(err){
            return res.send(err);
        }
        if(!student){
            return res.json({success: false, message: 'No user with that admission number was found'});
        }
        if(!isValidPassword(student, req.body.password)){
            return res.json({success: false, message: "Invalid password provided"});
        }
        if(student.status !== 'Active'){
            return res.json({
                success: false, 
                message: 'Your accout is inactive. Please consult an admin'
            });
        }
        
        console.log('Successfully logged in user: ' + student.admission_no);
        
        //give the user a token that will be stored in the browser and used for authentication
        var token = createToken(student);
        
        return res.json({
            success: true,
            first_name: student.first_name,
            last_name: student.last_name,
            id: student._id,
            email_address: student.email_address,
            user_type: student.user_type,
            token: token
        });
    });
});



/* This route logs in an admin into the system */
router.post('/admin/login', function(req,res){
    Admin.findOne({email_address: req.body.email_address.toLowerCase()})
            .select('first_name last_name email_address user_type password')
            .exec(function(err, admin){
        if(err){
            return res.send(err);
        }
        if(!admin){
            return res.json({
                success: false, 
                message: 'No admin with that email address number was found'
            });
        }
        if(!isValidPassword(admin, req.body.password)){
            return res.json({
                success: false, 
                message: "Invalid password provided"
            });
        }
        
        console.log('Successfully logged in user: ' + admin.email_address);
        
        //give the user a token that will be stored in the browser and used for authentication
        var token = createToken(admin);
        
        return res.json({
            success: true,
            first_name: admin.first_name,
            last_name: admin.last_name,
            id: admin._id,
            email_address: admin.email_address,
            user_type: admin.user_type,
            token: token
        });
    });
});

/* This route logs in a instructor into the system */
router.post('/instructor/login', function(req,res){
    Instructor.findOne({email_address: req.body.email_address.toLowerCase()})
            .select('first_name last_name email_address user_type password')
            .exec(function(err, instructor){
        if(err){
            return res.send(err);
        }
        if(!instructor){
            return res.json({success: false, message: 'No user with that email address was found'});
        }
        if(!isValidPassword(instructor, req.body.password)){
            return res.json({success: false, message: "Invalid password provided"});
        }
        
        console.log('Successfully logged in user: ' + instructor.email_address);
        
        //give the user a token that will be stored in the browser and used for authentication
        var token = createToken(instructor);
        
        return res.json({
            success: true,
            first_name: instructor.first_name,
            last_name: instructor.last_name,
            id: instructor._id,
            email_address: instructor.email_address,
            user_type: instructor.user_type,
            token: token
        });
    });
});

/* This route logs in a expert on a certain field of study into the system */
router.post('/expert/login', function(req,res){
    Student.findOne({email_address: req.body.email_address.toLowerCase()})
            .select('email_address password')
            .exec(function(err, expert){
        if(err){
            return res.send(err);
        }
        if(!expert){
            return res.json({success: false, message: 'No user with that email address was found'});
        }
        if(!isValidPassword(expert, req.body.password)){
            return res.json({success: false, message: "Invalid password provided"});
        }
        
        console.log('Successfully logged in user: ' + expert.email_address);
         
        //give the user a token that will be stored in the browser and used for authentication
        var token = createToken(expert);
        
        return res.json({
            success: true, 
            email_address: expert.email_address, 
            token: token
        });
    });
});



/**
 * This method confirms whether the password provided matches the one stored in the database.
 * 
 * @param {object} user
 * @param {string} password
 * @returns {string}
 */
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

/**
 * This method creates a hash of a password
 * 
 * @param {string} password
 * @returns {string}
 */
var createHash = function(password){
    var salt = bCrypt.genSaltSync(10);
    return bCrypt.hashSync(password, salt, null);
};

/**
 * This method decodes some of the user information into a token that will be used in logging in.
 * 
 * @param {object} user
 * @returns {string}
 */
var createToken = function(user){
    var token = jwt.sign({
        email_address: user.email_address,
        loginTime: Date.now()
    }, secretKey, {expiresIn: 86400});
    
    return token;
};

module.exports = router;
module.exports.createHash = createHash;
module.exports.createToken = createToken;
module.exports.isValidPassword = isValidPassword;