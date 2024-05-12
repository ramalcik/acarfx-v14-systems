const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "dağıt",
    Komut: ["dagit"],
    Kullanim: "dağıt",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let voiceChannel = message.member.voice.channelId;
    if (!voiceChannel) return message.reply(`${cevaplar.prefix} Ses kanalında olmadığın için işlem iptal edildi.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    let publicRooms = message.guild.channels.cache.filter(c => c.parentId === kanallar.publicKategorisi && c.id !== kanallar.sleepRoom && c.type === Discord.ChannelType.GuildVoice);
    message.member.voice.channel.members.array().forEach((m, index) => {
      setTimeout(() => {
         if (m.voice.channelId !== voiceChannel) return;
         m.voice.setChannel(publicRooms.random());
      }, index*1000);
    });
    message.reply(`${message.guild.emojiGöster(emojiler.Onay)} \`${message.member.voice.channel.name}\` adlı ses kanalındaki üyeleri rastgele public odalara dağıtılmaya başladım!`);
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
  }
}