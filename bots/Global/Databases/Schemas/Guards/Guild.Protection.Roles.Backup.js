const mongoose = require("mongoose");

const schema = mongoose.model('lastGuildRole', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    Role: String,
    Reason: String,
    Permissions: String,
    Date: {type: Date, default: Date.now()}
}));

module.exports = schema;