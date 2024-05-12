const { Client, Message} = require("discord.js");
const cmdBans = require('../../../../Global/Databases/Schemas/Others/Users.Command.Blocks')
const { genEmbed } = require('../../../../Global/Init/Embed');
const Discord = require("discord.js")
module.exports = {
    Isim: "bulkmessage",
    Komut: ["bulkmessage", "bulkdelete"],
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    await sonMesajlar(message, uye.id)
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli üyenin ${message.channel} kanalında ki son 100 mesajı başarıyla kaldırıldı.`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })
  }
};


async  function sonMesajlar(message, id) {
    let messages = await message.channel.messages.fetch({ limit: 100 });
             let filtered = messages.filter((x) => x.author.id === id).array().splice(0, 100);
             message.channel.bulkDelete(filtered);
   } 