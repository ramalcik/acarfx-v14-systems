const mongoose = require("mongoose");

const schema = mongoose.model('Crew', new mongoose.Schema({
    guildID: String,
    name: String,
    discriminator: String,
    rol: String,
}));

module.exports = schema;
