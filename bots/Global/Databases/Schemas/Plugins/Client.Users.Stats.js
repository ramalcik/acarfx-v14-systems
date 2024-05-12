const mongoose = require("mongoose");

const schema = mongoose.model('Stat', new mongoose.Schema({
    guildID: String,
    userID: String,

    // Level Sistemi
    messageLevel: {type: Number, default: 1},
    messageXP: {type: Number, default: 0},
    voiceLevel: {type: Number, default: 1},
    voiceXP: {type: Number, default: 0},
    
    // Haftalık İstatistik
    voiceStats: {type: Map, default: new Map()},
    chatStats: {type: Map, default: new Map()},
    voiceCameraStats: {type: Map, default: new Map()},
    voiceStreamingStats: {type: Map, default: new Map()},

    // Sunucu Boyu İstatistik
    totalVoiceStats: {type: Number, default: 0},
    totalChatStats: {type: Number, default: 0},
    allVoice: { type: Object, default: {} },
    allMessage: { type: Object, default: {} },
    allCategory: { type: Object, default: {} },

    // Yetkili Sistemi istatistik!
    taskVoiceStats: {type: Map, default: new Map()},
    upstaffVoiceStats: {type: Map, default: new Map()},
    upstaffChatStats: {type: Map, default: new Map()},

    //Sunucu boyu istatistik!
    lifeVoiceStats: {type: Map, default: new Map()},
    lifeChatStats: {type: Map, default: new Map()},
    lifeTotalChatStats: {type: Number, default: 0},
    lifeTotalVoiceStats: {type: Number, default: 0},
}));

module.exports = schema;