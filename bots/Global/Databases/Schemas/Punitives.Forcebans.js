const mongoose = require("mongoose");

const schema = mongoose.model('forceBan', new mongoose.Schema({
    No: Number,
    _id: String,
}));

module.exports = schema;

