const { Client, Message, EmbedBuilder, Guild } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "say",
    Komut: ["istatistik"],
    Kullanim: "say",
    Aciklama: "Sunucunun bütün verilerini gösterir",
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
  onRequest: async function (client, message, args, guild) {
  if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
  message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined) 
  const ramal = new EmbedBuilder() 
  .setDescription(`<t:${Math.floor(Date.now() / 1000)}:R> **Tarihli Sunucu Verisi**
  
  \` > \` Sunucumuzda şuanda toplam \`${message.guild.memberCount}\` kişi bulunmakta.
  \` > \` Sunucumuzda şuan aktif \`${message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size}\` kişi bulunmakta.
  \` > \` Toplam taglı sayısı \`${message.guild.members.cache.filter(u => u.user.username.includes(ayarlar.tag)).size}\` kişi.
  \` > \` Sunucumuzda toplam \`${message.guild.roles.cache.get(roller.boosterRolü).members.size}\` ${message.guild.premiumTier != "NONE" ? `(\`${message.guild.premiumTier.replace("TIER_1","1").replace("TIER_2","2").replace("TIER_3", "3")}. Lvl\`)` : ``} boost bulunmakta.
  \` > \` Sesli sohbetlerde toplam \`${message.guild.channels.cache.filter(channel => channel.type == Discord.ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b)}\` (\`+${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size} Bot\`) kişi bulunmakta.`)
  .setThumbnail(message.guild.iconURL({ extension: 'png' }))
  message.channel.send({ embeds: [ramal]});
    }
};