var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
    title: String,
    lat: Number,
    lng: Number
})

module.exports = mongoose.model('Map', mapSchema);