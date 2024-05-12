const mongoose = require("mongoose");

const schema = mongoose.model('lastMemberRole', new mongoose.Schema({
    _id: String,
    Roles: Array,
    Reason: String,
    Date: {type: Date, default: Date.now()}
}));

module.exports = schema;