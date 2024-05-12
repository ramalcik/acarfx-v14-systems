const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  guildId: String,
  Day: { type: Number, default: 1 },
  NextUpdate: { type: Number, default: new Date().setHours(24, 0, 0, 0) }
});

const model = mongoose.model("Date", schema);

module.exports = model;