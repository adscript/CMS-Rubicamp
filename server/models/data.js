var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    letter: String,
    frequency: Number
})

module.exports = mongoose.model('Data', dataSchema);
