var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataDateSchema = new Schema({
    datadate: String,
    frequency: Number
})

module.exports = mongoose.model('DataDate', dataDateSchema);