const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');

const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yükselt",
    Komut: ["yukselt"],
    Kullanim: "yükselt <@cartel/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
    Kategori: "stat",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x)) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!kullanıcı) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.guild.members.cache.get(kullanıcı.id);
    if (!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.id == message.member.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    if(ayarlar.type && !uye.user.username.includes(ayarlar.tag)) return message.reply(cevaplar.taglıalım).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
      if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => uye.user.username.includes(x))) return message.reply({
        content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
      }).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 7500);
      })
    let Upstaffs = await Upstaff.findOne({_id: uye.id})
if(!Upstaffs ) {
    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
} else {
    let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
    let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)+1];
    if(!rolBul) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye son yetkiye ulaştığı için yükseltme işlemi yapılamaz.`, ephemeral: true})
    if(rolBul.No > ayarlar.yükseltimSınırı && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x))) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye}, isimli üyeyi en fazla şuan ki yetkiye kadar yükseltebilirsin.`, ephemeral: true}).then(x => setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500))
    if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
    if(roller.altYönetimRolleri.some(x => rolBul.exrol == x) || roller.yönetimRolleri.some(x => rolBul.exrol == x) || roller.üstYönetimRolleri.some(x => rolBul.exrol == x)) {
        await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
    } else {
        await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
    }
    await Upstaff.updateOne({_id: uye.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
    let newRoles = []
    uye.roles.cache.filter(x => yetkiBilgisi.rol != x.id && !yetkiBilgisi.exrol.includes(x.id)).map(x => newRoles.push(x.id))
    if(rolBul && rolBul.rol) {
      newRoles.push(rolBul.rol)
      if(rolBul.exrol && rolBul.exrol.length >= 1) newRoles.push(...rolBul.exrol)
    }
    uye.roles.set(newRoles)
    await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
        Date: Date.now(),
        Process: "YÜKSELTİLME",
        Role: rolBul ? rolBul.rol : roller.başlangıçYetki,
        Author: message.member.id
    }}}, { upsert: true }) 
    
       await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
        Tagged: 0,
        Register: 0,
        Invite: 0,
        Staff: 0,
        Sorumluluk: 0,
        CompletedSorumluluk: false,
        completedMission: 0,
        CompletedStaff: false,
        CompletedInvite: false,
        CompletedAllVoice: false,
        CompletedPublicVoice: false,
        CompletedTagged: false,
        CompletedRegister: false,
       }}}, {upsert: true});
       let logKanalı = message.guild.kanalBul("terfi-log")
       if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne yükseltti.`)]})
	 await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})      
await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0, "Toplantı": 0, "Etkinlik": 0 }}, {upsert: true});
      message.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne yükseltildi.`, ephemeral: true }).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      })


        

    
}

    }
};

