const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { guildBackup } = require('../../../../Global/Init/Guild.Backup');
const roleBackup = require('../../../../Global/Databases/Schemas/Guards/Backup/Guild.Roles')
const guildSettings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const CategoryChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const Discord = require("discord.js")
module.exports = {
    Isim: "rolkur",
    Komut: ["kur"],
    Kullanim: "rol @cartel/ID",
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
    if (!args[0] || isNaN(args[0])) return message.reply("Lütfen bir rol belirtin!")
    await roleBackup.findOne({ roleID: args[0] }, async (err, data) => {
      if (!data) return message.channel.send(`${cevaplar.prefix} Belirtilen rol geçmişte bulunamadığından işlem iptal edildi `), message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      let newRole;
      if(data.icon) {
       newRole = await message.guild.roles.create({
          name: data.name,
          color: data.color,
          hoist: data.hoist,
          icon: data.icon,
          permissions: data.permissions,
          position: data.position,
          mentionable: data.mentionable,
          reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
        });
      } else {
        newRole = await message.guild.roles.create({
          name: data.name,
          color: data.color,
          hoist: data.hoist,
          permissions: data.permissions,
          position: data.position,
          mentionable: data.mentionable,
          reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
        });
      }
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} <@&${newRole.id}> (\`${newRole.id}\`) isimli rol oluşturuldu ve gereken ayarları yapıldı.
**Dağıtılacak Rol**: ${newRole}
**Dağıtılacak Üye Sayısı**: ${data.members.length}
**Tahmini Dağıtım Süresi**: ${(data.members.length>1000 ? parseInt((data.members.length*(250/1000)) / 60)+" dakika" : parseInt(data.members.length*(250/1000))+" saniye")}`)] })
      await client.rolKur(args[0], newRole)
      await client.queryManage(args[0], newRole.id).catch(err => {})
    }).catch(err => {});

  }
};