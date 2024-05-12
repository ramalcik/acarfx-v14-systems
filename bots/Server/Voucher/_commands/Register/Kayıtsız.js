const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
const getLimit = new Map();

const Discord = require("discord.js")
module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregistered","kayitsizyap","kayitsiz"],
    Kullanim: "kayıtsız <@cartel/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
    Kategori: "teyit",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (getLimit.get(message.author.id) >= ayarlar.kayıtsızLimit) return message.reply(cevaplar.bokyolu).then(s => setTimeout(() => s.delete().catch(err => {}), 7500));
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.reply(cevaplar.kayıtsız).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ayarlar.isimyas) {
      if(ayarlar.type) {
        await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag  : (ayarlar.tagsiz ? ayarlar.tagsiz  : (ayarlar.tag || ""))} İsim | Yaş`)
      } else {
        await uye.setNickname(`İsim | Yaş`)
      }
    } else {
      if(ayarlar.type) {
        await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag  : (ayarlar.tagsiz ? ayarlar.tagsiz  : (ayarlar.tag || ""))} Kayıtsız`)
      } else {
        await uye.setNickname(`Kayıtsız`)
      }
    }
    uye.setRoles(roller.kayıtsızRolleri)
    if(uye.voice.channel) uye.voice.disconnect()
    let data = await Kullanici.findOne({_id: uye.id});
    if(data && data.Name) await Kullanici.updateOne({_id: uye.id}, {$set: { "Gender": "Kayıtsız" }, $push: { "Names": { Staff: message.member.id, Date: Date.now(), Name: data.Name, State: "Kayıtsıza Atıldı" } } }, { upsert: true })
    uye.Delete()
    uye.removeStaff()
    let kayıtsızLog = message.guild.kanalBul("kayıtsız-log")
    if(kayıtsızLog) kayıtsızLog.send({embeds: [ new genEmbed().setDescription(`${uye} isimli üye ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> **${sebep}** nedeniyle \`${message.guild.name}\` sunucusunda kayıtsız üye olarak belirlendi.`)]})
    message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesi, **${sebep}** nedeniyle başarıyla kayıtsız'a gönderildi.`)]})
    uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${String(Date.now()).slice(0, 10)}:R> kayıtsız'a atıldın.`)]}).catch(x => {
      })
    if(Number(ayarlar.kayıtsızLimit) && ayarlar.kayıtsızLimit > 1) {
      if(!message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        setTimeout(() => {
          getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
        },1000*60*5)
      }
    }
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};