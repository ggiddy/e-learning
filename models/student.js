/* global module */

var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true, select: false},   
    email_address: {type: String, required: true, index: {unique: true}},
    user_type: {type: String, required: true},
    admission_no: {type: String, required: true},
    faculty: {type: String, required: true},
    classes_taken: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class', index: {unique: true}}]
});

module.exports = mongoose.model('Student', studentSchema);