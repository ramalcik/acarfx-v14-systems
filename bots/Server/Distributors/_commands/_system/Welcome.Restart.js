const { Client, Message} = require("discord.js");
const children = require("child_process");

const Discord = require("discord.js")
module.exports = {
    Isim: "welcome-restart",
    Komut: ["w-r","wrest","welrest","welcome-r"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    
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
    let load = await message.reply({content: `Hoş geldin botları yeniden başlatılırken. Lütfen bekleyin.`})
    const ls = children.exec(`pm2 restart Voices`);
    ls.stdout.on('data', function (data) {
        load.edit({content: `Başarıyla hoş geldin ses botları yeniden başlatıldı. ${message.guild.emojiGöster(emojiler.Onay)}`})
        .then(x => {
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
          setTimeout(() => {
            x.delete().catch(err => {

            })
          }, 7500);  
        })
    });
    }
};