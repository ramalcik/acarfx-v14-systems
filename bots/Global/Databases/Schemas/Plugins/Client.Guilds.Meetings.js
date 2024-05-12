const mongoose = require("mongoose");

const schema = mongoose.model('Meeting', new mongoose.Schema({
    guildID: String,
    authorId: String,
    channelId: String,
    endAuthorId: String,
    endDate: Date,
    Date:{type: Date, default: Date.now()},
    Joining: {type: Array, default: []},
    Leaving: {type: Array, default: []},
}));

module.exports = schema;