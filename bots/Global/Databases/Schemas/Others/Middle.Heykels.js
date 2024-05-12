const mongoose = require("mongoose");

const schema = mongoose.model('Heykel', new mongoose.Schema({
    _id: String,
    date: Date,
    added: String,
}));

module.exports = schema;
