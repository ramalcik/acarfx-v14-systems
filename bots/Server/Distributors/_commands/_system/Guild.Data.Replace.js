const { Client, Message, Collection } = require("discord.js");
const util = require("util")
const { genEmbed } = require('../../../../Global/Init/Embed')
const Discord = require("discord.js")
module.exports = {
    Isim: "tagreplace",
    Komut: ["tagdegis","tagdeğiş","datadegis","datadeğiş", "datareplace"],
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
    let eski = args[0]
    if(!eski) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    let yeni = args.splice(1).join(" ")
    if(!yeni) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    
    const guildSettings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
    let veriData = await guildSettings.findOne({ guildID: sistem.SERVER.ID })
    let sunucuData = veriData.Ayarlar 
    if(sunucuData) {              
        if(eski === sunucuData.tag) {
            await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.tag": yeni}}, {upsert: true})
            message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla sunucunun yeni tag'ı \`${yeni}\` olarak belirlendi.`)]})
        }
        if(eski === sunucuData.serverName) {
          await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.serverName": yeni}}, {upsert: true})
      }
    }

    await message.guild.roles.cache.filter(x => x.name.includes(eski)).forEach(x => {
        x.setName(x.name.replace(eski, yeni))
    })

    await message.guild.channels.cache.filter(x => x.name.includes(eski)).forEach(x => {
        x.setName(x.name.replace(eski, yeni))
    })
    
    
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
  }
};