const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { guildBackup } = require('../../../../Global/Init/Guild.Sync');
const Discord = require("discord.js")
module.exports = {
    Isim: "sync",
    Komut: ["senk","senkronizasyon"],
    Kullanim: "sync",
    Aciklama: "Sunucudaki üyeler içerisinde tagı olmayanları kayıtsıza at.",
    Kategori: "-",
    Extend: false,
    
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
    if(!ayarlar.staff.includes(message.member.id)) return;
    const embed = new genEmbed() 
    await guildBackup.guildChannels()
    await guildBackup.guildRoles()
    message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **${message.guild.name}** sunucusunun rol ve kanal senkronizasyonu güncellendi.`)]})
    .then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 8500);
    })
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    client.logger.log(`ROL => Manuel olarak senkronizasyon işlemi gerçekleştirildi. (${message.author.username})`, "backup") 
 }
};