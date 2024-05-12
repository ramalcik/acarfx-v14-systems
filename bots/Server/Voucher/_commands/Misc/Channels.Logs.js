const { Client, Message, EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");

const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "kanallog",
    Komut: ["kanallogu","kanal-logu","channellogs", "kanal-log"],
    Kullanim: "kanallog #kanal/ID",
    Aciklama: "Bir üyenin rol geçmişini görüntüler.",
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
   */

  onRequest: async function (client, message, args) {
    if(!roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.kanalBul(args[0])
    if(!kanal) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000)); 
    let _data = await Users.find({"Voices.channel": kanal.id, "Voices.state": "KATILDI"})

    let joined = []

    _data.forEach(async (x) => {
      let find = x.Voices.reverse().find(y => y.channel == kanal.id)
      await joined.push({ id: x._id, date: find.date})
    })
    
    _data = joined.filter(x => message.guild.members.cache.get(x.id)).slice(0, 15).sort((a, b) => b.date - a.date).map((value, index) => {
      let member = message.guild.members.cache.get(value.id)
      return `\` ${index + 1} \` ${member} ${member.user.username} (<t:${String(value.date).slice(0, 10)}:R>)`
    }).join("\n")
    let load = await message.reply({content: `${kanal} isimli kanalın giriş çıkışları kontrol ediliyor...`})
    if(joined.length <= 0) return load.edit(`${kanal} isimli kanalın giriş çıkışları kontrol edildi fakat daha önce bu kanala giriş yapan bulunamadı. ${cevaplar.prefix}`)
    await load.edit({content: null, embeds: [
      new genEmbed().setDescription(`Aşağıda ${kanal} kanalına son giriş yapan 15 üye listelenmektedir. Toplam da bu kanala giriş yapan ${joined.length} üye bulundu.

${_data}`)
    ]})
    setTimeout(() => {
      load.delete().catch(err => {})
    }, 20000)
 }
};