const { Client, Message, EmbedBuilder} = require("discord.js");
const Discord = require("discord.js")
module.exports = {
    Isim: "ex-yetkilisay",
    Komut: ["ex-yetkilisay"],
    Kullanim: "ex-yetkilisay",
    Aciklama: "Seste olmayan yetkilileri belirtir.",
    Kategori: "kurucu",
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
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));

    let roles = message.guild.roles.cache.get(roller.başlangıçYetki);
    let üyeler = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= roles.position && !uye.voice.channel)
    var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
    if(üyeler.size == 0) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    message.channel.send(`Online olup seste olmayan <@&${roles.id}> rolündeki ve üzerinde ki yetkili sayısı: ${üyeler.size ? üyeler.size : 0} `)
       message.channel.send(``+ üyeler.map(x => "<@" + x.id + ">").join(",") + ``)
    }
};