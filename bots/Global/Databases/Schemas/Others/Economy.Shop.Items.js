const mongoose = require("mongoose");

const schema = mongoose.model('Shop', new mongoose.Schema({
    name: String,
    type: {type: String, default: "normal"},
    desc: String,
    coin: {type: Number, default: 0},
    gold: {type: Number, default: 0},
    emoji: String,
    role: {type: Boolean, default: false},
    roleID: String
}));

module.exports = schema;
