const mongoose = require("mongoose");

const schema = mongoose.model('Custom', new mongoose.Schema({
    Name: String,
    Roles: Array,
    Text: String,
    Secret: String,
    Date: Date,
    Access: {type: Array, default: []},
    Author: String,
}));

module.exports = schema;
