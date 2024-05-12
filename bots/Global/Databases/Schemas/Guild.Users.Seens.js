const mongoose = require("mongoose");

module.exports = mongoose.model('Seen', new mongoose.Schema({
    userID: String,
    lastSeen: {type: Number, default: Date.now()},
    lastOnline: Number,
    lastOffline: Number,
    lastMessage: Number,
    lastVoice: Number,
    lastAvatar: Number,
    lastUsername: Number,
    lastDiscriminator: Number,
    last: {type: Object, default: {}},  
}));