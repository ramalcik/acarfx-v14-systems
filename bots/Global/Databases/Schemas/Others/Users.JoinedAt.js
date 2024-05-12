const mongoose = require("mongoose");

const schema = mongoose.model('JoinedAt', new mongoose.Schema({
    _id: String,
    date: Number
}));

module.exports = schema;
