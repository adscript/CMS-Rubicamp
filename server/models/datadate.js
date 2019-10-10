var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataDateSchema = new Schema({
    letter: String,
    frequency: Number
})

module.exports = mongoose.model('DataDate', dataDateSchema);