const { Client, Message } = require("discord.js");
const Kullanıcı = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats');
const Discord = require("discord.js")
module.exports = {
    Isim: "üyesıfırla",
    Komut: ["date-user-delete", "kayıt-temizle", "register-data-delete","üyetemizle"],
    Kullanim: "kayıt-temizle",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "-",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!uye) return message.channel.send(`${message.guild.emojiGöster(emojiler.Iptal)} Bir üye belirtmelisin.`)
    if(!await Kullanıcı.findOne({ _id: uye.id })) return message.channel.send(`${cevaplar.prefix} ${uye} profiline sahip üyenin sunucu üzerinde verisi bulunamadı.`);
    await uye.Delete()
    await Stats.deleteOne({userID: uye.id})
    await Kullanıcı.deleteOne({_id: uye.id});
    await message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesinin tüm verileri ve tüm kayıt bilgileri sunucudan temizlendi.`)]})
    await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};