const mongoose = require("mongoose");

const schema = mongoose.model('privateCommand', new mongoose.Schema({
    name: String,
    type: String,
    prefix: Boolean,
    allowed: {type: Array, default: []},
    content: String,
    created: String,
    date: {type: Number, default: Date.now()},
}));

module.exports = schema;