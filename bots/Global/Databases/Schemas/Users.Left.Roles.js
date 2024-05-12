const mongoose = require("mongoose");

const schema = mongoose.model('leftedRole', new mongoose.Schema({
    _id: String,
    _roles: {type: Array, default: []}
}));

module.exports = schema;