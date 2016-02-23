/* global module */

var mongoose = require('mongoose');

var instructorSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true, select: false},   
    email_address: {type: String, required: true, index: {unique: true}},
    user_type: {type: String, required: true},
    faculty: {type: String, required: true},
    classes_taught: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
    status: {type: String, default: 'Active'}
});

module.exports = mongoose.model('Instructor', instructorSchema);