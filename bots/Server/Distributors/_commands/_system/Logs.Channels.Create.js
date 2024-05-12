const { Client, Message } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const normalLoglar = [
    "isim-log",
    "kayıt-log",
    "kayıtsız-log",
    "taglı-log",
    "terfi-log",
    "yetki-ver-log",
    "yetki-bırakan",
    "yetki-çek-log",
    "mesaj-log",
    "ses-log",
    "nsfw-log",
    "bkes-log",
    "taşı-log",
    "underworld-log",
    "ban-log",
    "jail-log",
    "şüpheli-log",
    "yasaklı-tag-log",
    "mute-log",
    "sesmute-log",
    "uyarı-log",
    "rol-ver-log",
    "rol-al-log",
    "magaza-log",
    "görev-log",
    "görev-bilgi",
    "görev-tamamlayan",
    "başvuru-log",
    "şikayet-log",
    "guard-log",
    "guild-log",
    "safe-command-log",
    "forceban-log",
]
const Discord = require("discord.js")
module.exports = {
    Isim: "logkur",
    Komut: ["logkanalkur"],
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
    if(ayarlar.type) normalLoglar.push("tag-log");
    const kontrol = message.guild.channels.cache.find(channel => channel.type === Discord.ChannelType.GuildCategory && channel.name === 'SERVER-LOGS');
    if(kontrol) return message.channel.send({ embeds: [ new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png"})}).setDescription(`Kanallar zaten daha önceden kurulmuş.`)]})
    if(!kontrol) {
    const parent = await message.guild.channels.create({ name: 'SERVER-LOGS', type: Discord.ChannelType.GuildCategory });
    for (let index = 0; index < normalLoglar.length; index++) {
        let element = normalLoglar[index];
        await message.guild.channels.create({
          name: element.name,
          type: Discord.ChannelType.GuildText,
          parent: parent.id, permissionOverwrites: [
          { id: message.guild.roles.everyone, deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages] }
          ]
        })
    }
}
   
  }
}