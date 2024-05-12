const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed')
let zaman = new Map();
const Discord = require("discord.js")
module.exports = {
    Isim: "booster",
    Komut: ["b","boost","zengin"],
    Kullanim: "booster <Belirlenen Isim>",
    Aciklama: "Sunucuya takviye atan üyeler bu komut ile isim değişimi yapar.",
    Kategori: "diğer",
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
  onRequest: async (client, message, args) => {
      
      let embed = new genEmbed()
      if (!message.member.roles.cache.has(roller.boosterRolü) && (roller.özelRoller && !roller.özelRoller.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
      if (zaman.get(message.author.id) >= 1) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Sunucu takviyecisi özellik komutunu sadece **15 Dakika** ara ile kullanabilirsin.`, ephemeral: true}), message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
      if(ayarlar.type && ayarlar.isimyas) {
        if(roller.Yetkiler.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) {
          let isim = args.join(' ');
          if (!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
          let Nickname = message.member.nickname.replace(ayarlar.tagsiz, "").replace(ayarlar.tag, "").replace(" ", "").split(" | ")[0]
          if(Nickname && message.member.manageable) {
            message.member.setNickname(message.member.displayName.replace(Nickname, isim)).catch(err => {})
            zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
            setTimeout(() => {
              zaman.delete(message.author.id)
            }, 1000 * 60 * 15 * 1)
            return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
          } else {
            return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
          }
        }
      }
     
      let yazilacakIsim;
      let isim = args.join(' ');
      if (!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
      if(ayarlar.type) yazilacakIsim = `${message.member.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim}`
      if(!ayarlar.type) yazilacakIsim = `${isim}`;
      if(message.member.manageable) {
      message.member.setNickname(`${yazilacakIsim}`).then(devam => {
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      	      zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
	    setTimeout(() => {
		    zaman.delete(message.author.id)
	    }, 1000 * 60 * 15 * 1)
      }).catch(cartel =>  message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined))
    } else {
      message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    }
  }
};