const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const MEETING_INFO = require('../../../../Global/Databases/Schemas/Plugins/Client.Guilds.Meetings');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Discord = require("discord.js")
module.exports = {
    Isim: "toplantı",
    Komut: ["toplanti", "yoklama","bireysel"],
    Kullanim: "toplantı <[Bireysel: toplantı <@cartel/ID>]>",
    Aciklama: "Belirtilen üyenin profil resmini büyültür.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    client._cached = new Map();

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar && !roller && !roller.Katıldı || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.reply(cevaplar.notSetup)
    if(!message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let embed = new genEmbed()
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    let MeetingData = await MEETING_INFO.findOne({ guildID: message.guild.id })
    let meetingStatus = Data.Ayarlar.Toplantı || false
    const toplantiKanal = message.member.voice.channel;
    if(!toplantiKanal) return message.reply(`Toplantı sistemi için herhangi bir ses kanalında bulunmalısınız. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));
    if(message.mentions.members.first() || message.guild.members.cache.get(args[0])) {
      let uye = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
      if(!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
   
      let _getBireysel = client._cached.get(uye.id)

      let buttons = [
        new ButtonBuilder()
        .setLabel(`Bireysel ${_getBireysel ? "Katıldı Olarak Bitir!" : "Başlat!"}`)
        .setCustomId(_getBireysel ? "b_end" : "b_start")
        .setEmoji(_getBireysel ? "943265806547038310" : "943265806341513287")
        .setStyle(ButtonStyle.Success),
      ]

      if(_getBireysel && _getBireysel.state == "START") buttons.push(
        new ButtonBuilder()
        .setLabel("İzinli/Mazeretli Olarak Bitir!")
        .setCustomId("b_izinli")
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setLabel("Katılmadı Olarak Bitir!")
        .setCustomId("b_katilmadi")
        .setStyle(ButtonStyle.Danger),
        )
      let _row = new ActionRowBuilder().addComponents(
        buttons
      )
      
      let bmsg = await message.reply({content: `Bireysel toplantı ${uye.user.username} için yükleniyor...`})

      bmsg.edit({content: null, embeds: [new genEmbed().setDescription(`Belirtilen ${uye} isimli üye için bireysel toplantı yönetimi aşağıda bulunan düğmeler ile yönetilebilir.`)], components: [_row]})

      var filter = (i) => i.user.id == message.author.id
      let _collector = bmsg.createMessageComponentCollector({filter: filter, time: 30000})

      _collector.on('collect', async (i) => {
        if(i.customId == "b_katilmadi") {
          client._cached.delete(uye.id)
          await Users.updateOne({_id: uye.id}, {$push: {
            "Meetings": {
            Meeting: "BİREYSEL",
            Channel: message.member.voice.channel.id,
            Date: Date.now(),
            Status: "KATILMADI"
          }}}, {upsert: true}) 
          bmsg.edit({content: null, components: [], embeds: [new genEmbed().setDescription(`${uye} isimli üyenin bireysel toplantısı katılmadı olarak kaydedildi.`)]})
          i.reply({content: `Başarıyla ${uye} isimli üyenin toplantısı katılmadı olarak kaydedildi.`, ephemeral: true})
          setTimeout(() => {
            bmsg.delete().catch(err => {})
          }, 5000)
        }
        if(i.customId == "b_izinli") {
          client._cached.delete(uye.id)
          await Users.updateOne({_id: uye.id}, {$push: {
            "Meetings": {
            Meeting: "BİREYSEL",
            Channel: message.member.voice.channel.id,
            Date: Date.now(),
            Status: "MAZERETLİ"
          }}}, {upsert: true}) 
          bmsg.edit({content: null, components: [], embeds: [new genEmbed().setDescription(`${uye} isimli üyenin bireysel toplantısı mazeretli olarak kaydedildi.`)]})
          i.reply({content: `Başarıyla ${uye} isimli üyenin toplantısı mazeretli olarak kaydedildi.`, ephemeral: true})
          setTimeout(() => {
            bmsg.delete().catch(err => {})
          }, 5000)
        }
        if(i.customId == "b_start") {
          bmsg.delete().catch(err => {})
          let _get = client._cached.get(uye.id)
          if(_get && _get.state == "START") return i.reply({content: `Belirtilen ${uye} isimli üyenin aktif bireysel toplantısı bulunmaktadır.`, ephemeral: true})
          client._cached.set(uye.id, {
            state: "START",
            date: Date.now(),
            channel: toplantiKanal.id,
            author: message.author.id,
          })
          if(uye.voice && !uye.voice.channel) {
            uye.send({content: `Merhaba! **${uye.user.username}**
Şuan da ${toplantiKanal} kanalında bireysel toplantınız başladı. 
Lütfen sese katılın aksi taktirde sizin yetkinize yaptırım olacaktır.`}).catch(err => {
  i.reply({ephemeral: true, content: `Başarıyla ${uye} isimli üyenin bireysel toplantısı başladı fakat **DM** kutusu kapalı olduğundan bildiremedim. Benim yerime sen bildirir misin?`, ephemeral: true})
})
i.reply({content: `Başarıyla ${uye} isimli üye ile bireysel toplantıyı başlattın.`, ephemeral :true })
          } else {
            uye.send({content: `Merhaba! **${uye.user.username}**
Şuan da ${toplantiKanal} kanalında bireysel toplantınız başladı.`}).catch(err => {})
            i.reply({content: `Başarıyla ${uye} isimli üyenin bireysel toplantısı başlattın. Belirtilen üye ${uye.voice.channel} kanalında seste bulunuyor.`, ephemeral :true })
          }
        }
        if(i.customId == "b_end") {
          let _get = client._cached.get(uye.id)
          if(!_get) return i.reply({content: `Belirtilen ${uye} isimli üyenin aktif bireysel toplantısı bulunmamaktadır.`, ephemeral: true}) 
                    await Users.updateOne({_id: uye.id}, {$inc: {
                      "Gold": 2
                    },$push: {
                      "Meetings": {
                      Meeting: "BİREYSEL",
                      Channel: message.member.voice.channel.id,
                      Date: Date.now(),
                      Status: "KATILDI"
                    },
                    "Transfers": { 
                      Uye: uye.id, 
                      Tutar: 2, 
                      Tarih: Date.now(),
                      Islem: "Altın (Bireysel Toplantı Bahşişi)"
                    }
                  }}, {upsert: true}) 
                  let staffCheck = await Users.findOne({_id: uye.id})
                  let Upstaff = await Upstaffs.findOne({_id: uye.id})
                  if(staffCheck && staffCheck.Staff && Upstaff) await client.Upstaffs.addPoint(uye.id, 50, "Toplantı")
          bmsg.edit({content: `${uye.user.username} Kişisinin bireysel toplantısı kapatılıyor.`, embeds: [], components: []})
          setTimeout(() => {
            client._cached.delete(uye.id)
            bmsg.edit({content: `${uye.user.username} Kişisinin bireysel toplantısı kapatıldı.`, embeds: [
              new genEmbed().setDescription(`**Bireysel Toplantı Kapatıldı!**

${uye} isimli kişisinin toplantısı ${meetingTime(Date.now() - _get.date)} sürmüş.
Toplantı verileri yetkisine yansıyacak şekilde kaydedildi ve ${message.member} tarafından sonlandırıldı.`)
            ], components: []})
          }, 3000)
        }
      })
      return;
    }
    if(toplantiKanal && toplantiKanal.members.size < 1) return message.reply(`Toplantı sistemi için ses kanalınızda en az bir kişi olmalı. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));


    if(MeetingData && MeetingData.authorId && MeetingData.channelId && Data.Ayarlar.Toplantı && message.guild.channels.cache.get(MeetingData.channelId) && message.member.voice.channel.id != MeetingData.channelId) return message.reply(`Şuan da aktif bir toplantı var. ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalına girerek toplantıyı yönetebilirsin. ${cevaplar.prefix}`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));
    let Row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("toplantıAç")
      .setLabel(`Toplantı ${meetingStatus ? "Bitir" : "Başlat"}`)
      .setStyle(meetingStatus ? ButtonStyle.Danger : ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId("Yoklama")
      .setLabel("Yoklama")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(meetingStatus ? false : true)
    )
    if(MeetingData && MeetingData.authorId && MeetingData.channelId && MeetingData.Date && MeetingData.endAuthorId && MeetingData.endDate && MeetingData.Joining && MeetingData.Leaving) {
      embed.addFields({ name: `Son Toplantı Bilgisi`, value: `
> Toplantıya **\`${MeetingData.Joining.length}\`** yetkili katılmış ${message.guild.emojiGöster(emojiler.Onay)}
> Toplantıya **\`${MeetingData.Leaving.length}\`** yetkili katılmamış ${message.guild.emojiGöster(emojiler.Iptal)}
> Toplantıya **\`${MeetingData.Leaving.length + MeetingData.Joining.length}\`** yetkili katılması beklendi.
> Yetkililerin **\`%${(MeetingData.Joining.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmış. **\`%${(MeetingData.Leaving.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmamış. 
> Toplantı ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalında gerçekleşmiş.
> Toplantı **\`${tarihsel(MeetingData.Date)}\`** tarihinde <@${MeetingData.authorId}> tarafından başlatılmış.
> Toplantı **\`${tarihsel(MeetingData.endDate)}\`** tarihinde <@${MeetingData.endAuthorId}> tarafından bitirilmiş.
> Toplantı **\`${meetingTime(MeetingData.endDate - MeetingData.Date)}\`** sürmüş.`})
    }
    message.reply({components: [Row], embeds: [embed
    .setDescription(`**Merhaba** ${message.member.user.username}
**${ayarlar.serverName}** sunucusunda şuan da toplantı durumu: **${meetingStatus ? "Aktif" : "Devre-dışı"}** ${meetingStatus ? message.guild.emojiGöster(emojiler.Onay) : message.guild.emojiGöster(emojiler.Iptal)}`)

    ]}).then(async (msg) => {
        var filter = (i) => i.user.id == message.member.id
        let collector = msg.createMessageComponentCollector({filter: filter, time: 120000})
        collector.on('collect', async (i) => {
          if(i.customId == "toplantıAç") {
              Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
              let meetingStatus = Data.Ayarlar.Toplantı || false
              if(meetingStatus) {
                await GUILDS_SETTINGS.updateOne({_id: 1}, {$set: {"Ayarlar.Toplantı": false}}, {upsert: true})
                await MEETING_INFO.updateOne({guildID: message.guild.id}, {$set: {
                  "endDate": Date.now(),
                  "endAuthorId": i.user.id,
                }}, {upsert: true})
                let KatilimData = await MEETING_INFO.findOne({guildID: message.guild.id}) || {Joining: [],Leaving: []};
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new genEmbed().setDescription(`Başarıyla ${message.member.voice.channel} kanalında bulunan toplandı bitirildi.
Son olarak katılım sağlayan tüm yetkililere ${message.guild.roles.cache.has(roller.Katıldı) ? message.guild.roles.cache.get(roller.Katıldı) : "@Silinen Rol"} rolü dağıtılmaya başlandı.\n
**Bitirilen Toplantı Bilgisi** ${message.guild.emojiGöster("943286130357444608")}
> Bu toplantıda katılması beklenen **(\`${KatilimData.Joining.length + KatilimData.Leaving.length} yetkili\`)**
> Bu toplantıda katılım sağlayan: **(\`${KatilimData.Joining.length} yetkili\`)** ${message.guild.emojiGöster(emojiler.Onay)}
> Bu toplantıda katılım sağlamayan: **(\`${KatilimData.Leaving.length} yetkili\`)** ${message.guild.emojiGöster(emojiler.Iptal)}
> Bu toplantı  **\`${meetingTime(KatilimData.endDate - KatilimData.Date)}\`** sürmüş.`)], components: []})
                if(KatilimData && KatilimData.Joining.length > 0) {
                  KatilimData.Joining.forEach(async (id) => {
                    let uye = message.guild.members.cache.get(id)
                    if(uye) uye.roles.add(roller.Katıldı).catch(err => {}) 
                    await Users.updateOne({_id: uye.id}, {$inc: {
                      "Gold": 1
                    },$push: {
                      "Meetings": {
                      Meeting: "GENEL",
                      Channel: message.member.voice.channel.id,
                      Date: Date.now(),
                      Status: "KATILDI"
                    },
                    "Transfers": { 
                      Uye: uye.id, 
                      Tutar: 1, 
                      Tarih: Date.now(),
                      Islem: "Altın (Toplantı Bahşişi)"
                    }
                  }}, {upsert: true}) 
                  let staffCheck = await Users.findOne({_id: uye.id})
                  let Upstaff = await Upstaffs.findOne({_id: uye.id})
                  if(staffCheck && staffCheck.Staff && Upstaff) await client.Upstaffs.addPoint(uye.id, 75, "Toplantı")
                  })
                }
                if(KatilimData && KatilimData.Leaving.length > 0) {
                  KatilimData.Leaving.forEach(async (id) => {
                    let uye = message.guild.members.cache.get(id)
                    if(roller.mazeretliRolü && uye.roles.cache.has(roller.mazeretliRolü)) {
                      await Users.updateOne({_id: id}, {$push: {"Meetings": 
                      {
                        Meeting: "GENEL",
                        Channel: message.member.voice.channel.id,
                        Date: Date.now(),
                        Status: "MAZERETLİ"
                      }
                    }}, {upsert: true}) 
                    } else {
                    await Users.updateOne({_id: id}, {$push: {"Meetings": 
                      {
                        Meeting: "GENEL",
                        Channel: message.member.voice.channel.id,
                        Date: Date.now(),
                        Status: "KATILMADI"
                      }
                    }}, {upsert: true}) 
                  }
                  })
                }
                await i.deferUpdate().catch(err => {})
              } else {
                msg.delete().catch(err => {})
                let katildiRolü = message.guild.roles.cache.get(roller.Katıldı)
                if(katildiRolü) katildiRolü.members.array().map(x => {
                  x.roles.remove(katildiRolü.id).catch(err => {})
                })
                await message.channel.send({embeds: [new genEmbed().setDescription(`Başarıyla ${message.member.voice.channel} kanalında toplantı başladı.`)]})
                await i.deferUpdate().catch(err => {})
                await GUILDS_SETTINGS.updateOne({_id: 1}, {$set: {"Ayarlar.Toplantı": true}}, {upsert: true})
                await MEETING_INFO.deleteMany({guildID: message.guild.id})
                await MEETING_INFO.updateOne({guildID: message.guild.id}, {$set: {
                  "Date": Date.now(),
                  "authorId": i.user.id,
                  "channelId": message.member.voice.channel.id,
                }}, {upsert: true})
              }
          }
          if(i.customId == "Yoklama") {
            let KatilimData = await MEETING_INFO.findOne({guildID: message.guild.id}) || {Joining: [],Leaving: []};
            let enAltYetkiliRolü = await message.guild.roles.cache.get(roller.altilkyetki)
            await msg.edit({embeds: [new genEmbed().setDescription(`Şuan da ${message.member.voice.channel} toplantı kanalında, yoklama alınmaya başlandı.`)]})
            let uyeler = message.guild.members.cache.array()
            let filteruye = uyeler.filter(uye => !uye.user.bot  && uye.roles.highest.position >= enAltYetkiliRolü.position)
            let sestekiYetkililer = filteruye.filter(uye => uye.voice.channel && uye.voice.channel.id == KatilimData.channelId);
            let sesteOlmayanYetkililer = filteruye.filter(uye => !uye.voice.channel);
            sestekiYetkililer.map(async (uye) => {
              if (!KatilimData.Joining.includes(uye.id) ) {
                  if(KatilimData.Leaving.includes(uye.id)) {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$pull: {Leaving: uye.id}}, {upsert: true})
                  } else {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$push: {Joining: uye.id}}, {upsert: true})
                  }
              }
            })

            sesteOlmayanYetkililer.map(async (uye) => {
              if (!KatilimData.Leaving.includes(uye.id) ) {
                  if(KatilimData.Joining.includes(uye.id)) {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$pull: {Joining: uye.id}}, {upsert: true})
                  } else {
                    await MEETING_INFO.updateOne({guildID: message.guild.id}, {$push: {Leaving: uye.id}}, {upsert: true})
                }
              }
            })
            await msg.edit({embeds: [new genEmbed().setDescription(`Başarıyla ${message.member.voice.channel} toplantı kanalında, yoklama alındı. ${message.guild.emojiGöster(emojiler.Onay)}`)]})
            await i.deferUpdate().catch(err => {})
          }
        })
        collector.on('end', async (i) => {
          msg.delete().catch(err => {})
        })
    })

      function meetingTime(duration) {  
        let arr = []
        if (duration / 3600000 > 1) {
          let val = parseInt(duration / 3600000)
          let durationn = parseInt((duration - (val * 3600000)) / 60000)
          arr.push(`${val} saat`)
          arr.push(`${durationn} dakika`)
        } else {
          let durationn = parseInt(duration / 60000)
          arr.push(`${durationn} dakika`)
        }
        return arr.join(", ") 
      };
    }
};