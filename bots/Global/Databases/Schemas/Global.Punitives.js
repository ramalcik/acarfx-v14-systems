const mongoose = require("mongoose");

const schema = mongoose.model('Punitive', new mongoose.Schema({
    No: Number,
    Member: String,
    Staff: String,
    Type: String,
    Reason: String,
    Duration: Date,
    Date: Date,
    Expried: Date,
    Remover: String,
    Active: { type: Boolean, default: true},
    
}));

module.exports = schema;

