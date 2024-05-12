const { EmbedBuilder } = require("discord.js");
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');

const Discord = require("discord.js")
module.exports = {
    Isim: "yetkipuan",
    Komut: ["altyetkipuan","yetkipuanekle"],
    Kullanim: "yetkipuan <@cartel/ID> <Puan>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
    Kategori: "kurucu",
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
    let embed = new genEmbed()
    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ayarlar.type && !uye.user.username.includes(ayarlar.tag)) return message.reply({
      content: `Belirtilen üyenin üzerinde ${ayarlar.tag} sembolü bulunmadığından işleme devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => uye.user.username.includes(x))) return message.reply({
      content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let yetkiKodu = parseInt(args[1]);
    if(isNaN(yetkiKodu)) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await client.Upstaffs.addPoint(uye.id, yetkiKodu, "Bonus")
    message.guild.kanalBul("terfi-log").send({embeds: [embed.setDescription(`${message.member} (\`${message.member.id}\`) isimli yönetici ${uye} (\`${uye.id}\`) isimli üyeye \`${yetkiKodu}\` yetki bonusu ekledi.`)]});
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
  }
};