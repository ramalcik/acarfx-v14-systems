const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yetkiçek",
    Komut: ["yçek","ytçek","yetkicek","ycek"],
    Kullanim: "yetkiçek <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kontrol = await Users.findOne({_id: uye.id}) || { Staff: false }
    if(kontrol && kontrol.Staff) uye.removeStaff(uye.roles.cache, true)
    await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
      Date: Date.now(),
      Process: "ÇEKİLDİ",
      Role: uye.roles.hoist ? uye.roles.hoist.id : roller.başlangıçYetki,
      Author: message.member.id
    }}}, { upsert: true }) 
    let altYetki = message.guild.roles.cache.get(roller.altilkyetki)
    if(altYetki) await uye.roles.remove(uye.roles.cache.filter(rol => altYetki.position <= rol.position))
    let yetkiliLog = message.guild.kanalBul("yetki-çek-log")
    if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyenin \`${tarihsel(Date.now())}\` tarihinde yetkisini aldı!`)]})
     message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye.toString()} isimli üyenin yetkisi alındı.`)]})
    .then(x => {
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      setTimeout(() => {
        x.delete()
      }, 7500);
    }) 
    
    }
};