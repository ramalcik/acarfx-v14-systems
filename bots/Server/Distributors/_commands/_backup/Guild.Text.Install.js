const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const CategoryChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const Discord = require("discord.js")
module.exports = {
    Isim: "metinkur",
    Komut: ["metinkur"],
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

    if (!args[0] || isNaN(args[0])) return message.reply("Lütfen Metin kanalı ID'si giriniz.")
    TextChannels.findOne({ channelID: args[0] }, async (err, data) => {
      if (!data) return;
      const newChannel = await message.guild.channels.create({
        name: data.name,
        type: Discord.ChannelType.GuildText,
        nsfw: data.nsfw,
        parentID: data.parentID,
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
      if(message.guild.channels.cache.get(data.parentID)) {
          newChannel.setParent(data.parentID)
      }
      await newChannel.permissionOverwrites.set(newOverwrite);
      await client.queryManage(args[0], newChannel.id)
      data.channelID = newChannel.id
      data.save()
    });
  }
};