const mongoose = require('mongoose')

const schema = mongoose.model('Backup', new mongoose.Schema({
    Code: {type: String, default: `AC-${secretOluştur(5)}`},
    Date: {type: Date, default: Date.now()},
    Caches: Object,
    Ayarlar: Object,
    talentPerms: Object,
}));

module.exports = schema;

function secretOluştur(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }