const { Client, Message } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
    Isim: "temizle",
    Komut: ["sil"],
    Kullanim: "sil <1-100>",
    Aciklama: "Belirlenen miktar kadar metin kanallarında ki metinleri temizler.",
    Kategori: "yönetim",
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
   * @param {Guild} guild
   */
  onRequest: async (client, message, args) => {
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) {
      return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    }
    else {
      message.channel.bulkDelete(Number(args[0]), true).catch(err => {}).then(msg => message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} <#${message.channel.id}> kanalında **${msg.size}** adet mesaj başarı ile temizlendi.`).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 5000);
      }))
    }
  }
};