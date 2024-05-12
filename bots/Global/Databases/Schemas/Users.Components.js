const mongoose = require("mongoose");

const schema = mongoose.model('Component', new mongoose.Schema({
    _id: String,
    Checks: {type: Array, default: []},
}));

module.exports = schema;