const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Coins = require('../../../../Global/Databases/Schemas/Client.Users');

const Discord = require("discord.js")
module.exports = {
    Isim: "günlük",
    Komut: ["günlükcoin","maaş","daily"],
    Kullanim: "günlük",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    Kategori: "eco",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    let uye = message.guild.members.cache.get(message.member.id);
    let Hesap = await Coins.findById({_id: uye.id}) 
        if(Hesap && Hesap.Daily) {
            let yeniGün = Hesap.Daily + (1*24*60*60*1000);
            if (Date.now() < yeniGün) {
                message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
                return message.reply(`${message.guild.emojiGöster(emojiler.Iptal)} Tekrardan günlük ödül alabilmen için **${kalanzaman(yeniGün)}** beklemen gerekiyor.`).then(x => {
setTimeout(() => {x.delete()}, 7500)
})
            }
        }
    let Günlük = Math.random();
    Günlük = Günlük*(5000-100);
    Günlük = Math.floor(Günlük)+100
    await Coins.updateOne({ _id: uye.id }, { $set: { "Daily": Date.now() }, $inc: { "Coin": Günlük } }, {upsert: true})
    await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    await message.reply({content: `**Başarıyla günlük ödül aldınız!**
Alınan günlük ödülünüz: \`${Günlük.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası\`
Yarın tekrardan gelirsen daha güzel ödüllerle seni karşılayacağım. ${message.guild.emojiGöster(emojiler.Onay)}`})
.then(mesaj => {
    setTimeout(() => {
        mesaj.delete()
    }, 12500);
})
   }
};