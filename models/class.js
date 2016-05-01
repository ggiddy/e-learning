/* global module */

var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
    class_name: {type: String, required: true}, 
    class_code: {type: String, required: true, index: {unique: true}},
    instructor: {type: mongoose.Schema.Types.ObjectId, ref: 'Instructor'},
    class_venue: {type: String, required: true},
    class_time: {type: String},
    class_duration: {type: String},
    status: {type: String, default: 'Active'} 
});

module.exports = mongoose.model('Class', classSchema);