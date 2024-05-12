const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const CategoryChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const Discord = require("discord.js")
module.exports = {
    Isim: "kategorikur",
    Komut: ["kategorikur"],
    Kullanim: "kategorikur @cartel/ID",
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
   
    if (!args[0] || isNaN(args[0])) return;
    CategoryChannels.findOne({ channelID: args[0] }, async (err, data) => {
      if (!data) return
      const newChannel = await message.guild.channels.create({
        name: data.name,
        type: Discord.ChannelType.GuildCategory,
        position: data.position,
      });
      await message.channel.send({ embeds: [embed.setDescription(`**${newChannel.name}** isimli kategorinin, \`${tarihsel(Date.now())}\` tarihli kategori yedeği kurulmaya başladı.`)]})
      const textChannels = await TextChannels.find({ parentID: args[0] });
      await TextChannels.updateMany({ parentID: args[0] }, { parentID: newChannel.id });
      textChannels.forEach(c => {
        const textChannel = message.guild.channels.cache.get(c.channelID);
        if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
        if(!textChannel) {

        }
      });
      const voiceChannels = await VoiceChannels.find({ parentID: args[0] });
      await VoiceChannels.updateMany({ parentID: args[0] }, { parentID: newChannel.id });
      voiceChannels.forEach(c => {
        const voiceChannel = message.guild.channels.cache.get(c.channelID);
        if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
        if(!voiceChannel) {

        }
      });
      const newOverwrite = [];
      for (let index = 0; index < data.overwrites.length; index++) {
        const veri = data.overwrites[index];
        newOverwrite.push({
          id: veri.id,
          allow: new Discord.PermissionFlagsBits(veri.allow).toArray(),
          deny: new Discord.Permissions(veri.deny).toArray()
        });
      }
      await newChannel.permissionOverwrites.set(newOverwrite);
      await client.queryManage(args[0], newChannel.id)
      data.channelID = newChannel.id
      data.save()
    });
  }
};