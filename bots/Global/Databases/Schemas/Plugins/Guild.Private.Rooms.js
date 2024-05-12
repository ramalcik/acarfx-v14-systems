const mongoose = require("mongoose");

const schema = mongoose.model('Room', new mongoose.Schema({
    guildID: String,
    userID: String,
    Date: {type: String, default: Date.now()},
    voiceChannelId: String,
    messageChannelId: String,
    permaRoom: {type: Boolean, default: false},
}));

module.exports = schema;