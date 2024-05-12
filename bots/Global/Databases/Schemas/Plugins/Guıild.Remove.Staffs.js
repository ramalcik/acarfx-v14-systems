const mongoose = require("mongoose");

const schema = mongoose.model('Unleash', new mongoose.Schema({
    _id: String,
    unleashPoint: {type: Number, default: 0},
    unleashRoles: {type: Array, default: []},
}));

module.exports = schema;