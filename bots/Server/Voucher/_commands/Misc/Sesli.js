const { Client, Message, EmbedBuilder, Guild } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
    Isim: "sesli",
    Komut: ["ses"],
    Kullanim: "sesli",
    Aciklama: "Sunucunun seste olan üyelerinin sayısını gösterir.",
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
  if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
  message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
  let pub = message.guild.channels.cache.filter(x => x.parentId == kanallar.publicKategorisi && x.type == Discord.ChannelType.GuildVoice).map(u => u.members.size).reduce((a, b) => a + b)
  let ses = message.guild.members.cache.filter(x => x.voice.channel).size
  let taglı = message.guild.members.cache.filter(x => { return x.user.username.includes(ayarlar.tag) && x.voice.channel && x.roles.cache.has(roller.tagRolü)}).size
 let tagsız = message.guild.members.cache.filter(x => { return !x.user.username.includes(ayarlar.tag) && x.voice.channel}).size
 let yetkili = message.guild.members.cache.filter(x => { return x.user.username.includes(ayarlar.tag) && x.voice.channel && roller.Yetkiler.some(yetkili => x.roles.cache.has(yetkili))}).size
 let kontrol;
   if(args[0] == "tüm") {
      kontrol = `\n${message.guild.emojiGöster(emojiler.Tag)} Public kanallarında **${global.sayılıEmoji(pub || 0)}** üye bulunmakta.
${ayarlar.type ? `${message.guild.emojiGöster(emojiler.Tag)} Ses kanallarında tagsız **${global.sayılıEmoji(tagsız)}** üye bulunmakta.
${message.guild.emojiGöster(emojiler.Tag)} Ses kanallarında taglı **${global.sayılıEmoji(taglı)}** üye bulunmakta.\n` : ``}${message.guild.emojiGöster(emojiler.Tag)} Ses kanallarında yetkili **${global.sayılıEmoji(yetkili)}** üye bulunmakta.`
   } else {
       kontrol = ``;
   }
  message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} Ses kanallarında **${global.sayılıEmoji(ses)}** üye bulunmakta.${kontrol}`).then(x =>{
    setTimeout(() => {
      x.delete()
    }, 15000);
  }); 
 }
};