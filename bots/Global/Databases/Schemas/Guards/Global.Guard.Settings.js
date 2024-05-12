const mongoose = require("mongoose");

const schema = mongoose.model('Guard', new mongoose.Schema({
    guildID: String,
    
    guildProtection: {type: Boolean, default: true},
    limit: {type: Boolean, default: true},
    auditLimit: {type: Number, default: 19},
    auditInLimitTime: {type: String, default: "2m"},
    
    roleGuard: {type: Boolean, default: true},
    channelGuard: {type: Boolean, default: true},
    botGuard: {type: Boolean, default: true},
    everyoneGuard: {type: Boolean, default: true},
    webhookGuard: {type: Boolean, default: true},
    guildGuard: {type: Boolean, default: true},
    webGuard: {type: Boolean, default: true},
    offlineGuard: {type: Boolean, default: true},
    emojiGuard: {type: Boolean, default: true},
    stickerGuard: {type: Boolean, default: true},

    pruneGuard: {type: Boolean, default: true},
    memberRoleGuard: {type: Boolean, default: true},
    banGuard: {type: Boolean, default: true},
    muteGuard: {type: Boolean, default: true},
    kickGuard: {type: Boolean, default: true},
    disconnectGuard: {type: Boolean, default: true},
    nicknameGuard: {type: Boolean, default: true},
    
    urlSpam: {type: Boolean, default: true},
    spamURL: {type: String},
    selfTokens: {type: Array, default: []},


    unManageable: {type: Array, default: []},
    BOTS: {type: Array, default: []},
    fullAccess: {type: Array, default: []},
    guildAccess: {type: Array, default: []},
    emojiAccess: {type: Array, default: []},
    rolesAcess: {type: Array, default: []},
    botAccess: {type: Array, default: []},
    channelsAccess: {type: Array, default: []},
    memberAccess: {type: Array, default: []},

    Process: { type: Array, default: []}

}));

module.exports = schema;