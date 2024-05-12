const { Client, Message, Util} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Discord = require("discord.js")
module.exports = {
    Isim: "af",
    Komut: ["toplu-ban-kaldır","bantemizle"],
    Kullanim: "af <[Toplu Yasaklama Kaldırır]>",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar.staff.includes(message.member.id)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const banneds = await message.guild.bans.fetch()
    await banneds.forEach(async member => {
      await message.guild.members.unban(member.user.id, `Yetkili: ${message.author.id}`)
      await Punitives.findOne({Member: member.user.id, Type: "Yasaklama", Active: true}).exec(async (err, res) => {
        if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true })
      })
    });
    if (message) await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};