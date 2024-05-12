const { Client, createMessageComponentCollector, ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder, EmbedBuilder} = require("discord.js");

const GUARD_SETTINGS = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const ms = require('ms')
const moment = require('moment')
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "güvenlik",
    Komut: ["yarram", "guard-settings","guards","keasyguard","guard"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    let uye = message.mentions.roles.first() || message.mentions.users.first() || message.mentions.channels.first() || message.guild.roles.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.guild.channels.cache.get(args[0])
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: message.guild.id})
    let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    ayarlar = guildSettings.Ayarlar
    let işlem = `${moment.duration(ms(guardSettings.auditInLimitTime)).format('h [saatde,] m [Dakikada]')}`
    let option = ["dokunulmaz", "full", "sunucu", "bot", "roller", "kanallar", "sağtık", "emojisticker"]
    let id;
    if(uye) id = uye.id
    let whiteListRow = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
        .setLabel("Dokunulmaz Yönetim")
        .setCustomId("dokunulmaz")
        .setEmoji("943291954756714558")
        .setStyle(guardSettings.unManageable.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Full Yönetim")
        .setCustomId("fullaccess")
        .setEmoji("943285868368633886")
        .setStyle(guardSettings.fullAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Sunucu Yönetimi")
        .setCustomId("guildsetting")
        .setEmoji("943285356340609094")
        .setStyle(guardSettings.guildAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
    ]) 
    let whiteListRowTwo = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
        .setLabel("Rol")
        .setCustomId("rolupdate")
        .setEmoji("943285259733184592")
        .setStyle(guardSettings.rolesAcess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Kanal")
        .setCustomId("channelupdate")
        .setEmoji("943290426562076762")
        .setStyle(guardSettings.channelsAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Sağ-Tık/Üye")
        .setCustomId("memberupdate")
        .setEmoji("943286130357444608")
        .setStyle(guardSettings.memberAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Emoji/Sticker")
        .setCustomId("emojistickerupdate")
        .setEmoji("943290394949591070")
        .setStyle(guardSettings.emojiAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setLabel("Bot")
        .setCustomId("botupdate")
        .setEmoji("925127916621291541")
        .setStyle(guardSettings.botAccess.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary),
    ])
    let whiteListRowThree = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
        .setLabel("Chat")
        .setCustomId("chatguvenli")
        .setEmoji("943290446329835570")
        .setStyle(ayarlar.chatİzinliler.includes(id) ? ButtonStyle.Success : ButtonStyle.Secondary)
    ])
    


    let home = new ButtonBuilder()
    .setCustomId("guard_main")
    .setLabel("Ana Menü")
    .setEmoji("943285868368633886")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

    let guardSetting = new ButtonBuilder()
    .setCustomId("guard_manager")
    .setLabel("Güvenlik Ayarları")
    .setEmoji("943286195406925855")
    .setStyle(ButtonStyle.Secondary)

    let guardManage = new ButtonBuilder()
    .setCustomId("guard_manage")
    .setLabel("Beyaz Liste Görüntüle")
    .setEmoji("943286130357444608")
    .setStyle(ButtonStyle.Secondary)
    let queryManage = new ButtonBuilder()
    .setCustomId("backup")
    .setLabel("Yedekleme İşlemi Başlat")
    .setEmoji("771063357674618912")
    .setStyle(ButtonStyle.Secondary)

    let closePanel = new ButtonBuilder()
    .setCustomId("closePanel")
    .setLabel("Kapat")
    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
    .setStyle(ButtonStyle.Danger)

    let oneRows = new ActionRowBuilder().addComponents([
        home,
        guardSetting,
        guardManage,
        queryManage,
        closePanel
    ])
    let anaMenu = new genEmbed().setColor("White")
    .setThumbnail(message.guild.iconURL({extension: 'png'}))
    .setDescription(`Aşağı da \`${ayarlar ? ayarlar.serverName ? ayarlar.serverName : message.guild.name : message.guild.name }\` sunucusunun güvenlik sistemi ve güvenliğe takılmış kayıtlar bulunmaktadır. Ayarları güncellemek istiyorsanız aşağıda ki düğmeleri kullanabilirsiniz.

**Güvenlik Bilgisi**
\` • \` Sunucu Güvenliği: \` ${guardSettings.guildProtection ? "Aktif ✅" : "Devre-Dışı ❌"} \`${guardSettings.guildProtection ? `\n\` • \` Limit Sistemi: \` ${guardSettings.limit ? "Aktif ✅" : "Devre-Dışı ❌"} \`${guardSettings.limit ? `\n\` • \` Limit Bilgisi: \` ${işlem} ${guardSettings.auditLimit} İşlem Hakkı Bulunmakta! \`` : ""}
\` • \` Haftalık Güvenlik Raporu: \` ${ayarlar.SMS ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` SMS/MMS Bilgilendirme: \` ${ayarlar.SMS ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Whatsapp Bilgilendirme: \` ${ayarlar.WHATSAPP ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Telegram Bilgilendirme: \` ${ayarlar.TELEGRAM ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Numaralar: \` ${ayarlar.Numaralar ? ayarlar.Numaralar.map(x => "+90" + x).join(", ")  : "Numara Bulunamadı!"} \``: ""}

**Son Güvenlik Kayıtları**
${guardSettings.Process ? guardSettings.Process.length > 0 ? guardSettings.Process.sort((a, b) => b.date - a.date).slice(0, 10).map((x, index) => `\` ${index + 1} \` <@!${x.target}> [**${x.type}**] ${x.member ? `(<@!${x.member}>) ` : ""}(<t:${String(x.date).slice(0, 10)}:R>)` ).join("\n")  : "Yakın zamanda bir kayıt bulunamadı." : "Yakın zamanda bir kayıt bulunamadı."}`)
    .setFooter({ text: `Bir üyeyi beyaz listeye ekleyip/çıkartmak için ${global.sistem.botSettings.Prefixs[0]}guard <@cartel/ID> komutunu kullanabilirsiniz.`})
    if(!uye) {
        message.channel.send({embeds: [anaMenu], components: [oneRows]}).then(async (msg) => {
            var filter = (i) => i.user.id == message.member.id
            let collector = msg.createMessageComponentCollector({filter: filter, time: 120000})
            collector.on('end', i => msg.delete().catch(err => {}))
            collector.on('collect', async (i) => {
                if(i.customId == "closePanel") {
                    message.delete().catch(err => {})
                    msg.delete().catch(err => {})
                }
                if(i.customId == "backup") {
                    const { guildBackup } = require('../../../../Global/Init/Guild.Backup');
                    await guildBackup.guildChannels()
                    await guildBackup.guildRoles()
                    oneRows.components[3].setDisabled(true).setLabel("Yedekleme Başarıyla Alındı!").setStyle(ButtonStyle.Success)
                }
              if(i.customId == "guard_manager") {
                let backMenu = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("maincikdon")
                    .setLabel("⏮️ Geri Dön")
                    .setStyle(ButtonStyle.Primary)
                )
                let cartelRow = new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                    .setCustomId("guardState")
                    .setLabel(`Güvenliği ${guardSettings.guildProtection ? "Kapat" : "Aç"}`)
                    .setEmoji("943285868368633886")
                    .setStyle(guardSettings.guildProtection ? ButtonStyle.Secondary : ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("limitState")
                    .setLabel(`Limiti ${guardSettings.limit ? "Kapat" : "Aç"}`)
                    .setDisabled(guardSettings.guildProtection ? false : true)
                    .setEmoji("943290394949591070")
                    .setStyle(guardSettings.limit ? ButtonStyle.Secondary : ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("limitSettings")
                    .setLabel(`Limit Ayarları`)
                    .setDisabled(guardSettings.limit ? false : true)
                    .setEmoji("943286195406925855")
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("smsState")
                    .setLabel(`SMS/MMS ${ayarlar.SMS ? "Kapat" : "Aç"}`)
                    .setDisabled(guardSettings.guildProtection ? false : true)
                    .setEmoji("943290446329835570")
                    .setStyle(ayarlar.SMS ? ButtonStyle.Secondary : ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("wpState")
                    .setLabel(ayarlar.SMS ? `WhatsApp/Telegram ${ayarlar.WHATSAPP || ayarlar.TELEGRAM ? "Kapat" : "Aç"}` : "SMS/MMS Gerekli")
                    .setDisabled(ayarlar.SMS ? false : true)
                    .setEmoji("943290446329835570")
                    .setStyle(ayarlar.SMS ? ayarlar.WHATSAPP || ayarlar.TELEGRAM ? ButtonStyle.Secondary : ButtonStyle.Danger : ButtonStyle.Success)
                ])
                msg.delete().catch(err => {})
                message.channel.send({embeds: [anaMenu], components: [cartelRow, backMenu]}).then(async (gmsg) => {
                    var filter = (i) => i.user.id == message.member.id
                    let collector = gmsg.createMessageComponentCollector({filter: filter, time: 120000})
                    collector.on('end', i => gmsg.delete().catch(err => {}))
                    collector.on('collect', async (i) => {
                        if(i.customId == "maincikdon") {
                            gmsg.delete().catch(err => {})
                            let kom = client.commands.find(x => x.Isim == "güvenlik")
                            kom.onRequest(client, message, args)
                            return;
                        }
                        if(i.customId == "guardState") {
                            let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                            if(guardSettings.guildProtection) {
                                cartelRow.components[2].setDisabled(true)
                                cartelRow.components[3].setDisabled(true)
                                cartelRow.components[1].setDisabled(true)
                                cartelRow.components[4].setDisabled(true)
                                cartelRow.components[0].setStyle(ButtonStyle.Danger).setLabel(`Güvenliği Aç`)
                                await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"guildProtection": false }}, {upsert: true})
                            } else if(!guardSettings.guildProtection) {
                                let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                                if(guildSettings) ayarlar = guildSettings.Ayarlar
                                cartelRow.components[1].setDisabled(false)
                                if(guardSettings.limit) cartelRow.components[2].setDisabled(false)
                                cartelRow.components[3].setDisabled(false)
                               if(ayarlar.SMS) cartelRow.components[4].setDisabled(false)
                                cartelRow.components[0].setStyle(ButtonStyle.Secondary).setLabel(`Güvenliği Kapat`)
                                await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"guildProtection": true }}, {upsert: true})
                                
                            }
                        }
                        if(i.customId == "limitState") {
                            let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                            if(guardSettings.limit) {
                                cartelRow.components[2].setDisabled(true)
                                cartelRow.components[1].setStyle(ButtonStyle.Danger).setLabel(`Limiti Aç`)
                                await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"limit": false }}, {upsert: true})
                            } else if(!guardSettings.limit) {
                                cartelRow.components[2].setDisabled(false)
                                cartelRow.components[1].setStyle(ButtonStyle.Secondary).setLabel(`Limiti Kapat`)
                                await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"limit": true }}, {upsert: true})
                                
                            }
                        }
                        if(i.customId == "limitSettings") {
                            gmsg.delete().catch(err => {})
                            let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                            işlem = `${moment.duration(ms(guardSettings.auditInLimitTime)).format('h [Saatde,] m [Dakikada]')}`
                            message.channel.send({embeds: [new genEmbed().setColor("White")
.setDescription(`Aşağı da \`${ayarlar ? ayarlar.serverName ? ayarlar.serverName : message.guild.name : message.guild.name }\` sunucusunun limit ayarları belirtilmektedir.

\` ••❯ \` **Limit Ayarları**: \` ${işlem} ${guardSettings.auditLimit} İşlem Hakkı Bulunmakta! \`

Olarak ayarlanmış. Ayarı güncellemek için dakika cinsinde işlem süresi belirtin.`).setFooter({ text: `Ana menüye dönmek için "iptal" yazabilirsiniz.`})]}).then(async (ymsg) => {
    var filter = (m) => m.author.id == message.member.id
    let collector = ymsg.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
    collector.on('collect', async (m) => {
        let sure = parseInt(m.content)
        if(m.content == "iptal") {
            ymsg.delete().catch(err => {})
            let kom = client.commands.find(x => x.Isim == "güvenlik")
            kom.onRequest(client, message, args)
            return;
        }
        if(!sure) return m.reply(`${cevaplar.prefix} Lütfen rakam girilmeli veyada boş bırakılmamalıdır.`).then(x => 
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500));
        let surecik = String(sure+"m")
        ymsg.delete().catch(err => {})
        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"auditInLimitTime": surecik }}, {upsert: true})
        message.channel.send({embeds: [new genEmbed().setColor("White")
.setDescription(`Başarıyla Limit Zamanlaması Ayarlandı!

\` ••❯ \` **Limit Ayarları**: \` ${moment.duration(ms(surecik)).format('h [Saatde,] m [Dakikada]')} ${guardSettings.auditLimit} İşlem Hakkı Bulunmakta! \`

Olarak ayarlanmış fakat işlem sayısı ayarlanmamış. Ayarlamak için lütfen kaç işlem olacağını belirtin.`).setFooter({ text: `Ana menüye dönmek için "iptal" yazabilirsiniz.`})]}).then(async (yarramm) => {
    var filter = (m) => m.author.id == message.member.id
    let collector = yarramm.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
    collector.on('collect', async (m) => {
        if(m.content == "iptal") {
            yarramm.delete().catch(err => {})
            let kom = client.commands.find(x => x.Isim == "güvenlik")
            kom.onRequest(client, message, args)
            return;
        }
        let islemcik = parseInt(m.content)
        if(!islemcik) return m.reply(`${cevaplar.prefix} Lütfen rakam girilmeli veyada boş bırakılmamalıdır.`).then(x => 
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500));
        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"auditLimit": islemcik }}, {upsert: true})
        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("anamenucuk")
            .setLabel("Güvenlik Ayarlarına Dön")
            .setEmoji("943285868368633886")
            .setStyle(ButtonStyle.Secondary)
        )
        let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
        yarramm.edit({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla sunucunun limit ayarları güncellendi.

\` ••❯ \` **Limit Ayarları**: \` ${moment.duration(ms(guardSettings.auditInLimitTime)).format('h [Saatde,] m [Dakikada]')} ${guardSettings.auditLimit} İşlem Hakkı Bulunmakta! \`

Olarak ayarlandı.`)], components: [row]}).then(async (cartel) => {
    var filter = (i) => i.user.id == message.member.id && i.customId == "anamenucuk"
    let collector = yarramm.createMessageComponentCollector({filter: filter, max: 1, time:30000})
    collector.on('end', i => cartel.delete().catch(err => {}))
    collector.on('collect', async (i) => {
        cartel.delete().catch(err => {})
        let kom = client.commands.find(x => x.Isim == "güvenlik")
        kom.onRequest(client, message, args)
        i.deferUpdate().catch(err => {})
    })
})    
    })
})
    })

})
                        }
                        if(i.customId == "smsState") {
                            let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                            if(guildSettings) ayarlar = guildSettings.Ayarlar
                            if(ayarlar.SMS) {
                                cartelRow.components[3].setStyle(ButtonStyle.Danger).setLabel(`SMS/MMS Aç`)
                                cartelRow.components[4].setDisabled(true).setStyle(ButtonStyle.Success).setLabel(`SMS/MMS Gerekli`)
                                await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"Ayarlar.SMS": false }}, {upsert: true})
                                await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"Ayarlar.WHATSAPP": false, "Ayarlar.TELEGRAM": false }}, {upsert: true})
                            } else if(!ayarlar.SMS) {
                                cartelRow.components[4].setDisabled(false).setLabel(`WhatsApp/Telegram Aç`).setStyle(ButtonStyle.Danger)
                                cartelRow.components[3].setStyle(ButtonStyle.Secondary).setLabel(`SMS/MMS Kapat`)
                                await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"Ayarlar.SMS": true }}, {upsert: true})
                                
                            }
                        }
                        if(i.customId == "wpState") {
                            let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                            if(guildSettings) ayarlar = guildSettings.Ayarlar
                            if(ayarlar.WHATSAPP | ayarlar.TELEGRAM) {
                                cartelRow.components[4].setStyle(ButtonStyle.Danger).setLabel(`WhatsApp/Telegram Aç`)
                                await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"Ayarlar.WHATSAPP": false, "Ayarlar.TELEGRAM": false }}, {upsert: true})
                                
                            } else if(!ayarlar.WHATSAPP || !ayarlar.TELEGRAM) {
                                cartelRow.components[4].setStyle(ButtonStyle.Secondary).setLabel(`WhatsApp/Telegram Kapat`)
                                await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, { $set: {"Ayarlar.WHATSAPP": true, "Ayarlar.TELEGRAM": true }}, {upsert: true})
                                
                            }
                        }


                        let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                        let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                        if(guildSettings) ayarlar = guildSettings.Ayarlar
                        anaMenu.setThumbnail(message.guild.iconURL({extension: 'png'})).setDescription(`Aşağı da \`${ayarlar ? ayarlar.serverName ? ayarlar.serverName : message.guild.name : message.guild.name }\` sunucusunun güvenlik sistemi ve güvenliğe takılmış kayıtlar bulunmaktadır. Ayarları güncellemek istiyorsanız aşağıda ki düğmeleri kullanabilirsiniz.

**Güvenlik Bilgisi**
\` • \` Sunucu Güvenliği: \` ${guardSettings.guildProtection ? "Aktif ✅" : "Devre-Dışı ❌"} \`${guardSettings.guildProtection ? `\n\` • \` Limit Sistemi: \` ${guardSettings.limit ? "Aktif ✅" : "Devre-Dışı ❌"} \`${guardSettings.limit ? `\n\` • \` Limit Bilgisi: \` ${işlem} ${guardSettings.auditLimit} İşlem Hakkı Bulunmakta! \`` : ""}
\` • \` Haftalık Güvenlik Raporu: \` ${ayarlar.SMS ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` SMS/MMS Bilgilendirme: \` ${ayarlar.SMS ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Whatsapp Bilgilendirme: \` ${ayarlar.WHATSAPP ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Telegram Bilgilendirme: \` ${ayarlar.TELEGRAM ? "Aktif ✅" : "Devre-Dışı ❌"} \`
\` • \` Numaralar: \` ${ayarlar.Numaralar ? ayarlar.Numaralar.map(x => "+90" + x).join(", ")  : "Numara Bulunamadı!"} \``: ""}

**Son Güvenlik Kayıtları**
${guardSettings.Process ? guardSettings.Process.length > 0 ? guardSettings.Process.sort((a, b) => b.date - a.date).slice(0, 10).map((x, index) => `\` ${index + 1} \` <@!${x.target}> [**${x.type}**] ${x.member ? `(<@!${x.member}>) ` : ""}(<t:${String(x.date).slice(0, 10)}:R>)` ).join("\n")  : "Yakın zamanda bir kayıt bulunamadı." : "Yakın zamanda bir kayıt bulunamadı."}`)
                        gmsg.edit({embeds: [anaMenu], components: [cartelRow, backMenu]}).catch(err => {})  
                        i.deferUpdate().catch(err => {})
                    })
                })
              }
              if(i.customId == "guard_manage") {
                let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                if(guildSettings) ayarlar = guildSettings.Ayarlar
                let listEmbed = new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ extension: "png", forceStatic: true})}).setDescription(`Aşağı da \`${ayarlar ? ayarlar.serverName ? ayarlar.serverName : message.guild.name : message.guild.name }\` sunucusunun beyaz listede ki üyeleri ve rolleri listelenmektedir.`)
                .addFields({ name: "Dokunulmaz", value: `${guardSettings.unManageable.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.unManageable.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Limitli Full Yönetim", value: `${guardSettings.fullAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.fullAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Sunucu (Düzenleme)", value: `${guardSettings.guildAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.guildAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Bot (Ekleme/Çıkarma)", value: `${guardSettings.botAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.botAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Rol (Oluşturma/Kaldırma/Düzenleme)", value: `${guardSettings.rolesAcess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.rolesAcess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Kanal (Oluşturma/Kaldırma/Düzenleme)", value: `${guardSettings.channelsAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.channelsAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Sağ-Tık (Rol/Ban/Kick/Sustur/Bağlantı)", value: `${guardSettings.memberAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.memberAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                .addFields({ name: "Emoji/Sticker (Oluştur/Kaldır/Düzenle)", value: `${guardSettings.emojiAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).length >= 1 ? guardSettings.emojiAccess.filter(x => message.guild.members.cache.get(x) || message.guild.channels.cache.get(x) || message.guild.roles.cache.get(x)).map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, inline: false})
                                    msg.edit({embeds: [listEmbed]}).catch(err => {})                   
                    oneRows.components[2].setDisabled(true)
                    oneRows.components[0].setDisabled(false)
                    
                }
                if(i.customId == "guard_main") {
                    msg.edit({embeds: [anaMenu]}).catch(err => {})  
                    oneRows.components[2].setDisabled(false)
                    oneRows.components[0].setDisabled(true)
                }
                msg.edit({components: [oneRows]}).catch(err => {})  
                i.deferUpdate().catch(err => {})
            })
        })
    } else if(uye) {
        message.channel.send({embeds: [new genEmbed().setDescription(`**Merhaba!** ${message.member.user.username}

${uye} isimli ${message.guild.roles.cache.get(uye.id) ? "rolü" : message.guild.channels.cache.get(uye.id) ? "kanalı" : "üyeyi"} hangi güvenliğe eklemek/çıkarmak istersiniz?

**Bilgilendirme**:
Belirtilen üye, rol veya kanal ekli bir beyaz listede bulunuyorsa düğmenin rengi yeşile dönmektedir, bulunmuyor ise düğme füme rengine dönmektedir. :tada:`).setColor("Yellow")], components: [whiteListRow, whiteListRowTwo, whiteListRowThree]}).then(async (msg) => {
            var filter = (i) => i.user.id == message.member.id
            let collector = msg.createMessageComponentCollector({filter: filter, time: 45000})
            collector.on('end', async (i) => {
                msg.delete().catch(err => {})
            })
            collector.on('collect', async (i) => {
                if(i.customId == "dokunulmaz") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.unManageable.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"unManageable": id} }, {upsert: true})
                        await whiteListRow.components[0].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.unManageable.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"unManageable": id} }, {upsert: true})
                        await whiteListRow.components[0].setStyle(ButtonStyle.Success)
                    }
                } else if(i.customId == "fullaccess") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.fullAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"fullAccess": id} }, {upsert: true})
                        
                        await whiteListRow.components[1].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.fullAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"fullAccess": id} }, {upsert: true})
                        await whiteListRow.components[1].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "guildsetting") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.guildAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"guildAccess": id} }, {upsert: true})
                       
                        await whiteListRow.components[2].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.guildAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"guildAccess": id} }, {upsert: true})
                        await whiteListRow.components[2].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "rolupdate") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.rolesAcess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"rolesAcess": id} }, {upsert: true})
                       
                        await whiteListRowTwo.components[0].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.rolesAcess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"rolesAcess": id} }, {upsert: true})
                        await whiteListRowTwo.components[0].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "channelupdate") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.channelsAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"channelsAccess": id} }, {upsert: true})
                       
                        await whiteListRowTwo.components[1].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.channelsAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"channelsAccess": id} }, {upsert: true})
                        await whiteListRowTwo.components[1].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "memberupdate") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.memberAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"memberAccess": id} }, {upsert: true})
                       
                        await whiteListRowTwo.components[2].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.memberAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"memberAccess": id} }, {upsert: true})
                        await whiteListRowTwo.components[2].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "emojistickerupdate") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.emojiAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"emojiAccess": id} }, {upsert: true})
                       
                        await whiteListRowTwo.components[3].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.emojiAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"emojiAccess": id} }, {upsert: true})
                        await whiteListRowTwo.components[3].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "botupdate") {
                    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guardSettings.botAccess.includes(id)) {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"botAccess": id} }, {upsert: true})
                       
                        await whiteListRowTwo.components[4].setStyle(ButtonStyle.Secondary)
                    } else if(!guardSettings.botAccess.includes(id))  {
                        await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"botAccess": id} }, {upsert: true})
                        await whiteListRowTwo.components[4].setStyle(ButtonStyle.Success)
                       
                    }
                } else if(i.customId == "chatguvenli") {
                    let guildSettings = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                    if(guildSettings) ayarlar = guildSettings.Ayarlar
                    if(ayarlar.chatİzinliler.includes(id)) {
                        await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.chatİzinliler": id} }, {upsert: true})
                        await whiteListRowThree.components[0].setStyle(ButtonStyle.Secondary)
                    } else if(!ayarlar.chatİzinliler.includes(id)) {
                        await GUILD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.chatİzinliler": id} }, {upsert: true})
                        await whiteListRowThree.components[0].setStyle(ButtonStyle.Success)
                    }
                } else if(i.customId == "geridongeridon") {
                    let kom = client.commands.find(x => x.Isim == "güvenlik")
                    kom.onRequest(client, message, args)
                    return msg.delete().catch(err => {})
                }
                i.deferUpdate().catch(err => {})
                msg.edit({components: [whiteListRow, whiteListRowTwo, whiteListRowThree]}).catch(err => {})
            })
        })
    }
    
}
};

async function başHarfBüyült(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}