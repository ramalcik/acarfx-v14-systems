const mongoose = require("mongoose");

const schema = mongoose.model('commandBlock', new mongoose.Schema({
    _id: String,
    Date: Date,
    lastData: Object,
    
}));

module.exports = schema;
