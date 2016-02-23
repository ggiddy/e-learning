/* global module */

var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true, select: false},   
    email_address: {type: String, required: true, index: {unique: true}},
    user_type: {type: String, required: true},
    status: {type: String, default: 'Active'}
});

module.exports = mongoose.model('Admin', adminSchema);