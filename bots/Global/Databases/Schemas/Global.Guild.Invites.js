const mongoose = require('mongoose');

const model = mongoose.model("Invite", mongoose.Schema({
    guildID: { type: String },
    userID: { type: String },
    Inviter: String,
    total: { type: Number, trim: true,  min: 0 },
    regular: { type: Number, trim: true,  min: 0 },
    bonus: { type: Number, trim: true, min: 0 },
    leave: { type: Number, trim: true,  min: 0 },
    fake: { type: Number, trim: true,  min: 0 },
}))

module.exports = model;