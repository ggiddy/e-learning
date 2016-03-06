/* global module */

var mongoose = require('mongoose');

var resourseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true},
    uploaded_at: {type: Date, default: Date.now()}
    
});

module.exports = mongoose.model('Resourses', resourseSchema);