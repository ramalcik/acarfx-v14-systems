const { Client, Message} = require("discord.js");
const cmdBans = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs')
const { genEmbed } = require('../../../../Global/Init/Embed');
const Discord = require("discord.js")
module.exports = {
    Isim: "haksıfırla",
    Komut: ["hak-sıfırla", "hak"],
    Kullanim: "",
    Aciklama: "",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    await cmdBans.findByIdAndDelete(uye.id)
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üyenin \`${message.guild.name}\` sunucusunda ki yetki salma hakları \`${tarihsel(Date.now())}\` tarihinde sıfırlandı.`)]})
  }
};