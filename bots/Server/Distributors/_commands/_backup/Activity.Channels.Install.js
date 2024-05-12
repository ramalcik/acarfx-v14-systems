const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const CategoryChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const Discord = require("discord.js")
module.exports = {
    Isim: "testkur",
    Komut: ["testkur"],
    Kullanim: "kanalkur @cartel/ID",
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
    const embed = new genEmbed() 
   
    if (!args[0] || isNaN(args[0])) return message.reply("Lütfen bir kategori ID'si belirtin.")
    CategoryChannels.findOne({ channelID: args[0] }, async (err, data) => {
      if (!data) return message.channel.send(`${cevaplar.prefix} Belirtilen kategori kanalı geçmişte bulunamadığından işlem iptal edildi `), message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      const newChannel = await message.guild.channels.create({
        name: data.name,
        type: Discord.ChannelType.GuildCategory,
        position: data.position,
      });
      await message.channel.send({ embeds: [embed.setDescription(`**${newChannel.name}** isimli kategorinin, \`${tarihsel(Date.now())}\` tarihli kategori yedeği kurulmaya başladı.`)]})
      const textChannels = await TextChannels.find({ parentID: args[0] });
      textChannels.forEach(async (c) => {
           await textKur(c.channelID, message,embed, newChannel.id)
      
      });
      const voiceChannels = await VoiceChannels.find({ parentID: args[0] });
      voiceChannels.forEach(async (c) => {
            await voiceKur(c.channelID, message, embed, newChannel.id)
      });
      const newOverwrite = [];
      for (let index = 0; index < data.overwrites.length; index++) {
        const veri = data.overwrites[index];
        newOverwrite.push({
          id: veri.id,
          allow: new Discord.PermissionFlagsBits(veri.allow).toArray(),
          deny: new Discord.PermissionFlagsBits(veri.deny).toArray()
        });
      }
      await newChannel.permissionOverwrites.set(newOverwrite);
    });
  }
};


async function voiceKur(idcik, message, embed, parentID) {
    VoiceChannels.findOne({ channelID: idcik }, async (err, data) => {
        if (!data) return message.channel.send(`${cevaplar.prefix} Belirtilen ses kanal geçmişte bulunamadığından işlem iptal edildi `), message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        const newChannel = await message.guild.channels.create({
          name: data.name,
          type: Discord.ChannelType.GuildVoice,
          bitrate: data.bitrate,
          parentID: parentID,
          position: data.position,
          userLimit: data.userLimit ? data.userLimit : 0
        });
        await message.channel.send({ embeds: [embed.setDescription(`**${newChannel.name}** isimli ses kanalının, \`${tarihsel(Date.now())}\` tarihli ses kanalı kurulmaya başladı.`)]})
        const newOverwrite = [];
        for (let index = 0; index < data.overwrites.length; index++) {
          const veri = data.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Discord.PermissionFlagsBits(veri.allow).toArray(),
            deny: new Discord.PermissionFlagsBits(veri.deny).toArray()
          });
        }
        if(message.guild.channels.cache.get(parentID)) {
          newChannel.setParent(parentID)
      }   
        await newChannel.permissionOverwrites.set(newOverwrite);
      });
}

async function textKur(idcik, message, embed, parentID) {
    TextChannels.findOne({ channelID: idcik }, async (err, data) => {
        if (!data) return message.channel.send(`${cevaplar.prefix} Belirtilen metin kanal geçmişte bulunamadığından işlem iptal edildi `), message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        const newChannel = await message.guild.channels.create({
          name: data.name,
          type: Discord.ChannelType.GuildText,
          nsfw: data.nsfw,
          parentID: parentID,
          position: data.position,
          rateLimit: data.rateLimit,
        });
        await message.channel.send({ embeds: [embed.setDescription(`**${newChannel.name}** isimli metin kanalının, \`${tarihsel(Date.now())}\` tarihli metin kanalı kurulmaya başladı.`)]})
        const newOverwrite = [];
        for (let index = 0; index < data.overwrites.length; index++) {
          const veri = data.overwrites[index];
          newOverwrite.push({
            id: veri.id,
            allow: new Discord.PermissionFlagsBits(veri.allow).toArray(),
            deny: new Discord.Permissions(veri.deny).toArray()
          });
        }
        if(message.guild.channels.cache.get(parentID)) {
            newChannel.setParent(parentID)
        }
        await newChannel.permissionOverwrites.set(newOverwrite);
      });
}