const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { guildBackup } = require('../../../../Global/Init/Guild.Backup');
const roleBackup = require('../../../../Global/Databases/Schemas/Guards/Backup/Guild.Roles')
const guildSettings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const Discord = require("discord.js")
module.exports = {
    Isim: "rolsil",
    Komut: ["rolsil"],
    Kullanim: "rolsil @cartel/ID",
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
    let veriData = await guildSettings.findOne({ guildID: message.guild.id })
    let sunucuData = veriData.Ayarlar 
    const embed = new genEmbed() 
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(!rol) message.reply({content: `${cevaplar.prefix} Lütfen geçerli bir rol belirtin!`}).then(x => setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500)),message.reply(message.guild.emojiGöster(emojiler.Iptal)).catch(err => {})
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
    message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **${rol.name}** (\`${rol.id}\`) isimli rol \`${message.guild.name}\` sunucusundan silindi.`)] }).then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 35000)
    })
    setTimeout(async () => {
        await rol.delete().catch(err => {})
    }, 2500);

  }
};