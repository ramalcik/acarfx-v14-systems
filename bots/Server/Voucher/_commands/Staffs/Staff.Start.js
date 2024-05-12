const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yetkibaşlat",
    Komut: ["ytbaşlat","ybaşlat","yetkiliyap","yetkili"],
    Kullanim: "yetkibaşlat <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
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
    let embed = new genEmbed()
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && !roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !ayarlar.staff.includes(message.member.id)) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),message.reply(cevaplar.yenihesap).then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    });
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
    let yetkiliRol = uye.guild.roles.cache.get(roller.altilkyetki);
    let uyeUstRol = uye.guild.roles.cache.get(uye.roles.highest.id)
    if(yetkiliRol.rawPosition < uyeUstRol.rawPosition) return message.reply({
      content: `Belirtilen üyenin üzerinde yetkili rolü bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let yetkiSalma = await Unleash.findOne({_id: uye.id})
    if(yetkiSalma) {
      if(yetkiSalma.unleashPoint && yetkiSalma.unleashPoint == 1) {
        embed.setFooter({ text: `${uye.user.username} üyesi daha önce yetki salmış birdaha salarsa yetkili olamayacak.`})
      } else {
        embed.setFooter({ text: `${uye.user.username} üyesinin yetki salma hakkı ${yetkiSalma.unleashPoint ? yetkiSalma.unleashPoint : 0} adet bulunuyor.`})
      }
      if(yetkiSalma.unleashPoint >= 2 && !ayarlar.staff.includes(message.member.id)) {
        return message.reply({embeds: [new genEmbed().setFooter({ text: `${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`}).setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
          setTimeout(() => {
            x.delete()
          }, 12500);
          message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        })
      }
    }
    let kontrol = await Users.findOne({_id: uye.id})
    if(kontrol && kontrol.Staff) return message.reply(`${cevaplar.prefix} ${uye} isimli üye zaten yetkili olarak belirlenmiş.`);
    if(message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) {
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      await Users.updateOne({ _id: uye.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true })
      await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: uye.id, Date: Date.now() } } }, { upsert: true })
      message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> başarıyla yetkili olarak başlatıldı!`)], components: []});
      client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
      let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
      if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${uye} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından yetkili olarak başlatıldı.`)]}) 
      
      await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
        Date: Date.now(),
        Process: "BAŞLATILMA",
        Role: roller.başlangıçYetki,
        Author: message.member.id
      }}}, { upsert: true })
      message.member.Leaders("yetki", _statSystem.points.staff, {type: "STAFF", user: uye.id})
      uye.setNickname(uye.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})      
      return uye.roles.add(roller.başlangıçYetki).then(x => {
        uye.roles.add(roller.altilkyetki)
  client.Upstaffs.addPoint(uye.id,"1", "Bonus")
      });
    }
    let Row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId("OK")
      .setEmoji(message.guild.emojiGöster(emojiler.Onay).id)
      .setLabel("Kabul Ediyorum!")
      .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId("NO")
      .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
      .setLabel("Kabul Etmiyorum!")
      .setStyle(ButtonStyle.Secondary),
    )
    embed.setDescription(`${message.member.toString()} isimli yetkili seni **${message.guild.name}** sunucusunda ${roller.başlangıçYetki ? message.guild.roles.cache.get(roller.başlangıçYetki) ? `${message.guild.roles.cache.get(roller.başlangıçYetki)} yetkisinden yetkili` : "yetkili" : "yetkili"} yapmak istiyor. Kabul ediyor musun?`);
    await message.channel.send({content: uye.toString(), embeds: [embed], components: [Row]}).then(async (msg) => {
      const filter = i => i.user.id === uye.id
      const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], time: 30000 })
      collector.on('collect', async (i) => {
        if(i.customId == "OK") {
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
          await Users.updateOne({ _id: uye.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true })
          await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: uye.id, Date: Date.now() } } }, { upsert: true })
          msg.delete().catch(err => {})
          message.channel.send({content: null, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> başarıyla ${roller.başlangıçYetki ? message.guild.roles.cache.get(roller.başlangıçYetki) ? `${message.guild.roles.cache.get(roller.başlangıçYetki)} yetkisinde yetkili` : "yetkili" : "yetkili"} olarak başlatıldı!`)], components: []}).catch(err => {})
          let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
          if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${uye} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından yetkili olarak başlatıldı.`)]})      
          client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
          let verilcekRol = [roller.başlangıçYetki, roller.altilkyetki]
          uye.setNickname(uye.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})
          uye.roles.add(verilcekRol).then(x => client.Upstaffs.addPoint(uye.id,"1", "Bonus"))
          message.member.Leaders("yetki", _statSystem.points.staff, {type: "STAFF", user: uye.id})
          i.deferUpdate().catch(err => {})
        }
        if(i.customId == "NO") {
          msg.edit({content: message.member.toString(), components: [],embeds: [new genEmbed().setColor("Red").setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye.toString()} isimli üye, **${message.guild.name}** sunucusunda yetkili olma teklifini reddetti!`)], components: []}).catch(err => {});
          message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
          i.deferUpdate().catch(err => {})
        }
      })
      collector.on('end', i => {
        msg.delete().catch(err => {})
      }) 
    }).catch(err => {})
    }
};