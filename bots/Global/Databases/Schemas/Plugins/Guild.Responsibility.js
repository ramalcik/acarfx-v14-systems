const mongoose = require("mongoose");

const schema = mongoose.model('Responsibility', new mongoose.Schema({
    name: String,
    role: String,
    leaders: {type: Array, default: []},
    date: {type: Number, default: Date.now()},
    created: String,
}));

module.exports = schema;