/* global module */

var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    message: String,
    sender: String,
    class_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Message", messageSchema);