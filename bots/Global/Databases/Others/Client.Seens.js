const mongoose = require("mongoose");

module.exports = mongoose.model('allSeen', new mongoose.Schema({
    userID: String,
    messageSeen: {type: Number, default: Date.now()},
    voiceSeen:  {type: Number, default: Date.now()},
    lastSeen:  {type: Number, default: Date.now()},
    messages: {type: Array, default: []},
    voices: {type: Array, default: []},
    Guilds: {type: Array, default: []},
    lastGuild : String,
    allSeen: {type: Map, default: new Map()},
}));