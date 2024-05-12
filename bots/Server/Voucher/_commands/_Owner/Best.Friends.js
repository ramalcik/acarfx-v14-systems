const { EmbedBuilder } = require("discord.js");
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Heykel = require('../../../../Global/Databases/Schemas/Others/Middle.Heykels')
require('moment-duration-format');
require('moment-timezone');

const Discord = require("discord.js")
module.exports = {
    Isim: "best",
    Komut: ["best","best-friend","bestfriend"],
    Kullanim: "best <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
    Kategori: "kurucu",
    Extend: false,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
      
var CronJob = require('cron').CronJob
let heykelTemizle = new CronJob('0 0 * * *', async function() { 
   let guild = client.guilds.cache.get(sistem.SERVER.ID);
   if(!roller.Buttons) return;
   if(!roller.Buttons.bestFriendRolü) return;
   guild.members.cache.filter(x => x.roles.cache.has(roller.Buttons.bestFriendRolü)).forEach(uye => {
    if(uye.roles.cache.has(roller.Buttons.bestFriendRolü)) uye.roles.remove(roller.Buttons.bestFriendRolü).catch(err => {})
    })
    console.log("heykeller temizlendi...")
}, null, true, 'Europe/Istanbul');
heykelTemizle.start()
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!roller.Buttons) return;
    if(!roller.Buttons.bestFriendRolü) return;
    let embed = new genEmbed()
    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let allData = await Heykel.find({})
    if(args[0] == "liste") {
        return message.channel.send({embeds: [new genEmbed().setDescription(`${allData ? allData.filter(x => message.guild.members.cache.has(x._id)).map((x, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(x._id)} ${x.added ? message.guild.members.cache.has(x.added) ? `(${message.guild.members.cache.get(x.added)})` : "" : ""}`).join("\n") : "Yakın arkadaş sistemine eklenmiş bir üye bulunamadı."}`)]})
    }
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(0);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let data = await Heykel.findOne({_id: uye.id})
    let buttonKanalı = message.guild.kanalBul("best-friends")
    if(data) {
        message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesi ${roller.Buttons.bestFriendRolü ? message.guild.roles.cache.get(roller.Buttons.bestFriendRolü) : "@Best Friend"} rolünü alması için izin kaldırıldı!`)]}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500)
        });;
        await Heykel.deleteOne({_id: uye.id})
       if(roller.Buttons && roller.Buttons.bestFriendRolü && message.guild.roles.cache.get(roller.Buttons.bestFriendRolü)) uye.roles.remove(roller.Buttons.bestFriendRolü).catch(err => {})
        await buttonKanalı.permissionOverwrites.edit(uye.id, { ViewChannel: false, ReadMessageHistory: false });
        Discord.PermissionFlagsBits
    } else if(!data) {
        message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesi ${roller.Buttons.bestFriendRolü ? message.guild.roles.cache.get(roller.Buttons.bestFriendRolü) : "@Best Friend"} rolünü alması için izin eklendi!`)]}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500)
        });
        await Heykel.updateOne({_id: uye.id}, {$set: {"added":message.member.id, "date": Date.now()}}, {upsert: true})
        await buttonKanalı.permissionOverwrites.edit(uye.id, { ViewChannel: true, ReadMessageHistory: true });
    }
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
  }
};