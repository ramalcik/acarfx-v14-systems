const mongoose = require("mongoose");

const VK = mongoose.model('intervalVk', new mongoose.Schema({
    No: Number,
    _id: String,
    Duration: String
}));

const DC = mongoose.model('intervalDc', new mongoose.Schema({
    No: Number,
    _id: String,
    Duration: String
}));

const STREAM = mongoose.model('intervalStreamer', new mongoose.Schema({
    No: Number,
    _id: String,
    Duration: String
}));

const ETKINLIK = mongoose.model('intervalActivity', new mongoose.Schema({
    No: Number,
    _id: String,
    Duration: String
}));

module.exports = {VK, DC, STREAM, ETKINLIK};

