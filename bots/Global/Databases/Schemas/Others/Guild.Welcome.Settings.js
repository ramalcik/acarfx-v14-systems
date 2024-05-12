const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  guildId: String,
  Webhook: {type: Boolean, default: false},
  Text: String,
});

const model = mongoose.model("Welcome", schema);

module.exports = model;