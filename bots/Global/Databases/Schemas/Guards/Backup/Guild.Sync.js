const mongoose = require('mongoose');

const VoiceChannels = mongoose.model("voiceChannelSync", mongoose.Schema({
    channelID: String,
    name: String,
    bitrate: Number,
    parentID: String,
    position: Number,
    userLimit: Number,
    overwrites: Array,
}));

const TextChannels = mongoose.model("textSync", mongoose.Schema({
    channelID: String,
    name: String,
    nsfw: Boolean,
    parentID: String,
    position: Number,
    rateLimit: Number,
    overwrites: Array,
}));

const CategoryChannels = mongoose.model("categorySync", mongoose.Schema({
    channelID: String,
    name: String,
    position: Number,
    overwrites: Array,
}));

const Roles = mongoose.model("roleSync", mongoose.Schema({
    roleID: String,
    name: String,
    color: String,
    hoist: Boolean,
    position: Number,
    permissions: String,
    mentionable: Boolean,
    date: Number,
    members: Array,
    channelOverwrites: Array
  }))

module.exports = { VoiceChannels, TextChannels, CategoryChannels, Roles }