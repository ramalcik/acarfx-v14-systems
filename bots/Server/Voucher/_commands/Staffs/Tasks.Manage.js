const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder, StringSelectMenuBuilder, Util } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const moment = require('moment');
const ms = require('ms')
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');
const table = require('table');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
let rolId;
let periyod;
let ödül;
const Discord = require("discord.js")
module.exports = {
    Isim: "görevyönetim",
    Komut: ["görevsistemi","görev-yönetim","görevyönetimi"],
    Kullanim: "görevyönetim",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.yetkiliSesSureCevir = (date) => { return moment.duration(date).format('H'); };

    /**
     * @param {import("discord.js").Interaction} modal
     */
    client.on('interactionCreate', async (modal) => {
      let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
      if(!guild) {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      let uye = guild.members.cache.get(modal.user.id)
      if(!uye)  {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      if(modal.customId == "myModal") {
        let bilgi = {
          rol: modal.fields.getTextInputValue("rolId"),
          ödül: modal.fields.getTextInputValue("ödül"),
          periyod: modal.fields.getTextInputValue("t_selectInformationType") ? modal.fields.getTextInputValue("t_selectInformationType") : "unlimited",
        }
  
        if(bilgi && bilgi.rol && bilgi.periyod && bilgi.ödül) {
            let rol = guild.roles.cache.get(bilgi.rol) || guild.roles.cache.find(x => bilgi.rol.includes(x.name))
            if(!rol) {
              await modal.deferReply({ ephemeral: true })
              return await modal.followUp({content: `Belirtilen ID veya isimde bir rol bulunamadı.` , ephemeral: true })
            } 
            let Row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Gereksinim Ekle/Güncelle")
                .setCustomId("gereksinimEkleme"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji(guild.emojiGöster(emojiler.Iptal).id)
                .setCustomId("iptalEt")
                .setLabel("Görev Kurulumunu Sonlandır")
            )
            await modal.reply({components: [Row], embeds: [new genEmbed().setDescription(`**Merhaba!** ${uye.user.username}
Şimdi sırada ${rol} görevine gereksinim eklemede. Ekledikten sonra senin için görevleri dağıtacağım. Cevap vermen için "**30 Saniye**" süren var.`)], ephemeral: true })
            var filter = (i) => i.user.id == uye.id
            let collector = modal.channel.createMessageComponentCollector({filter: filter, max: 1, time: 30000})
            collector.on('collect', async (i) => {
              if (i.customId === "gereksinimEkleme") {
                  const setTasks = new ModalBuilder()
                      .setCustomId('cartelKe')
                      .setTitle('Görev Gereksinimi Ekle')
                      .addComponents(
                          new ActionRowBuilder().addComponents(
                              new TextInputBuilder()
                                  .setCustomId('genelSes')
                                  .setLabel("Kaç Saat Seste Durmalı?")
                                  .setStyle(TextInputStyle.Short)
                                  .setPlaceholder('Örn: 15')
                                  .setRequired(true)
                          ),
                          new ActionRowBuilder().addComponents(
                              new TextInputBuilder()
                                  .setCustomId('publicSes')
                                  .setLabel("Public/Streamer/Register'da Kaç Saat Durmalı?")
                                  .setStyle(TextInputStyle.Short)
                                  .setPlaceholder('Örn: 10')
                                  .setRequired(true)
                          ),
                          new ActionRowBuilder().addComponents(
                              new TextInputBuilder()
                                  .setCustomId('Yetkili')
                                  .setLabel("Kaç Yetkili Belirlemeli?")
                                  .setStyle(TextInputStyle.Short)
                                  .setPlaceholder('Örn: 5')
                                  .setRequired(true)
                          ),
                          new ActionRowBuilder().addComponents(
                              new TextInputBuilder()
                                  .setCustomId('Taglı')
                                  .setLabel("Kaç Taglı Belirlemeli?")
                                  .setStyle(TextInputStyle.Short)
                                  .setPlaceholder('Örn: 5')
                                  .setRequired(true)
                          ),
                          new ActionRowBuilder().addComponents(
                              new TextInputBuilder()
                                  .setCustomId('Davet')
                                  .setLabel("Kaç Davet Yapmalı?")
                                  .setStyle(TextInputStyle.Short)
                                  .setPlaceholder('Örn: 5')
                                  .setRequired(true)
                          )
                      );
                rolId = bilgi.rol
                periyod = bilgi.periyod
                ödül = bilgi.ödül
                await i.showModal(setTasks);
                await i.deferUpdate().catch(err => {})
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`Görev gerekesinim menüsü açıldı işleme burdan devam edilecek. ${i.guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
              }
  
              if(i.customId == "iptalEt") {
                await i.deferUpdate().catch(err => {})
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`Görev oluşturma/güncelleme işlemi başarıyla sonlandırıldı. ${i.guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
              }
  
            })
            collector.on('end', async (collected, reason) => {
              if(reason == "time") {
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`İşleminiz zaman aşımı nedeniyle sonlandırıldı. Daha sonra tekrar deneyin!`)], ephemeral: true})
              }
            })
  
        }
      }

      if(modal.customId == "cartelKe") {
        let bilgi = {
          genelses: modal.fields.getTextInputValue("genelSes"),
          publicses: modal.fields.getTextInputValue("publicSes"),
          taglı: modal.fields.getTextInputValue("Taglı") || 0,
          yetkili: modal.fields.getTextInputValue('Yetkili') || 0,
          davet: modal.fields.getTextInputValue('Davet') || 0,
          rol: rolId,
          ödül: ödül,
          süre: periyod
        }
        let rol = guild.roles.cache.get(bilgi.rol)
        if(!rol) {
          console.log(rolId)
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Rol bulunamadığından işlem iptal edildi.` , ephemeral: true })
        }

        let verilenGörev = 0;
        if(bilgi && bilgi.genelses > 0) verilenGörev++
        if(bilgi && bilgi.publicses > 0) verilenGörev++
        if(bilgi && bilgi.taglı > 0) verilenGörev++
        if(bilgi && bilgi.yetkili > 0) verilenGörev++
        if(bilgi && bilgi.davet > 0) verilenGörev++
        let Row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Görevi Ekle/Güncelle")
            .setCustomId("görevEkle"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji(guild.emojiGöster(emojiler.Iptal).id)
            .setCustomId("iptalEt")
            .setLabel("Görevi Iptal Et")
        )
        await modal.reply({components: [Row], embeds: [new genEmbed().setDescription(`**Rol Adı**: ${rol.name} (${rol})
**Roldeki Üye Sayısı**: \` ${rol.members.size} \`
${bilgi.süre == "unlimited" ? "**Görev Süresi**: **\` ~ \`**"  : `**Görev Süresi**: <t:${String(Date.now()+ms(String(bilgi.süre))).slice(0, 10)}:R>`}
**Görev Ödülü**: \` ${bilgi.ödül} Görev Puanı, ${ayarlar.serverName} Parası \`
**Toplam Verilen Görev**: \` ${verilenGörev} \`
**Genel Toplam Ses**: \` ${bilgi.genelses} Saat \`
**Public/Streamer/Register Ses**: \` ${bilgi.publicses} Saat \`
${bilgi.yetkili > 0 ? `**Yetkili**: \` ${bilgi.yetkili} Kişi \`` : `- Yetkili Görevi Verilmemiş!`}
${bilgi.taglı > 0 ? `**Taglı**: \` ${bilgi.taglı} Kişi \`` : `- Taglı Görevi Verilmemiş!`}
${bilgi.davet > 0 ? `**Davet**: \` ${bilgi.davet} Kişi \`` : `- Davet Görevi Verilmemiş!`}

Şimdi sırada ${rol} görevine eklediğin gereksinimleri onaylaman gerek. Onaylaman için "**30 Saniye**" süren var.`)], ephemeral: true })
            var filter = (i) => i.user.id == uye.id
            let collector = modal.channel.createMessageComponentCollector({filter: filter, max: 1, time: 30000})
            collector.on('collect', async (i) => {
              
              if(i.customId == "görevEkle") {
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`Başarıyla ${rol} görevi verildi/güncelledi ve dağıtım ${rol.members.size} kişi üzerine gerçekleşti. ${i.guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
                let görevData = await Tasks.findOne({Active: true, roleID: rol.id})
                if(görevData) {
                  await Tasks.deleteOne({Active: true, roleID: rol.id})
                }
                if(bilgi.süre == "unlimited") görevPush = { Active: true, AllVoice: bilgi.genelses, publicVoice: bilgi.publicses, Tagged: bilgi.taglı, Staff: bilgi.yetkili, Register: 0, Invite: bilgi.davet, Reward: bilgi.ödül, countTasks: Number(verilenGörev) }
                if(bilgi.süre != "unlimited") görevPush = { Active: true, AllVoice: bilgi.genelses, publicVoice: bilgi.publicses, Tagged: bilgi.taglı, Staff: bilgi.yetkili, Register: 0, Invite: bilgi.davet, Reward: bilgi.ödül, Time: Date.now()+ms(String(bilgi.süre)), countTasks: Number(verilenGörev) }
                let amcıklar = []
                let verilcekÜyeler = rol.members
                rol.members.forEach(async (orospuevladı) => {
                  amcıklar.push(orospuevladı.id)
                  await Stats.updateOne({guildID: sistem.SERVER.ID, userID: orospuevladı.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
                  await Users.updateOne({_id: orospuevladı.id}, {$set: { "Staff": true }}, { upsert:true })

                  await Upstaffs.updateOne({_id: orospuevladı.id}, { $set: {"Mission": {
                    Tagged: 0,
                    Register: 0,
                    Invite: 0,
                    Staff: 0,
                    completedMission: 0,
                    CompletedStaff: false,
                    CompletedInvite: false,
                    CompletedAllVoice: false,
                    CompletedPublicVoice: false,
                    CompletedTagged: false,
                    CompletedRegister: false,
                  }, "Yönetim": true }})
                })
                
                await Tasks.updateOne({roleID: rol.id}, {$set: görevPush, $push: {Users: amcıklar}}, {upsert: true})
                let görevBilgilendirme = guild.kanalBul("görev-bilgi")
                if(görevBilgilendirme) görevBilgilendirme.send({content: `${rol}`, embeds: [new genEmbed().setFooter({ text: `${sistem.botSettings.Prefixs[0]}görev komutu ile verilen görevlerinizi listeleyebilirsiniz.`}).setTitle(`${guild.emojiGöster(emojiler.sarıYıldız)} Bir Görev Daha Eklendi!`).setDescription(`${guild.emojiGöster(emojiler.Görev.Kek)} ${rol} rolünde bulunan ${verilcekÜyeler.map(x => x).slice(0,2).join(", ")} ${verilcekÜyeler.size > 2 ? `ve ${verilcekÜyeler.size - 2} daha fazlası...` : ''} üyeye(üyelerine) **${verilenGörev} adet** görev taktim edildi.`)]})
                verilcekÜyeler.forEach(sünnetsizibneler => {
                  sünnetsizibneler.send({embeds: [new genEmbed().setFooter({ text: `${sistem.botSettings.Prefixs[0]}görev komutu ile verilen görevlerinizi listeleyebilirsiniz.`}).setDescription(`${guild.emojiGöster(emojiler.sarıYıldız)} ${sünnetsizibneler} sana bir görev verildi görev bilgilerini öğrenmek için lütfen **${sistem.botSettings.Prefixs[0]}yetkim** komutundan detaylı bakabilirsin.`)]}).catch(err => {
                  })
                })
              
              
              }
  
              if(i.customId == "iptalEt") {
                await i.deferUpdate().catch(err => {})
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`Görev oluşturma/güncelleme işlemi başarıyla iptal edildi. ${i.guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
              }
  
            })
            collector.on('end', async (collected, reason) => {
              if(reason == "time") {
                await modal.editReply({components: [], embeds: [new genEmbed().setDescription(`İşleminiz zaman aşımı nedeniyle sonlandırıldı. Daha sonra tekrar deneyin!`)], ephemeral: true})
              }
            })

      }

      if(modal.customId == "deleteTasks") {
        let getInput = modal.fields.getTextInputValue('tasksId');
        let belirle =  guild.roles.cache.get(getInput) || guild.members.cache.get(getInput)

        if(!belirle) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Rol veya üyelerde bulunamadığından işlem iptal edildi.` , ephemeral: true })
        }
        let logKanal = guild.kanalBul("görev-log")
        if(guild.roles.cache.get(getInput)) {
            let uyeler = belirle.members
            let görevData = await Tasks.findOne({roleID: belirle.id})
            if(!görevData) {
              await modal.deferReply({ ephemeral: true })
              return await modal.followUp({content: `Belirtilen role ait bir görev bulunamadı!` , ephemeral: true })
            }
            if(logKanal) logKanal.send({embeds: [new genEmbed().setDescription(`${belirle} rolününe ait olan ${uyeler.map(x => x).slice(0,2).join(", ")} ${uyeler.size > 2 ? `ve ${uyeler.size - 2} daha fazlası...` : ''} üyeler(üyelerin) <t:${String(Date.now()).slice(0, 10)}:R> ${uye} tarafından tüm görev bilgileri temizlendi.`)]})
            await modal.reply({ephemeral: true, embeds: [new genEmbed().setDescription(`${uyeler.map(x => x.user.username).slice(0,2).join(", ")} ${uyeler.size > 2 ? `ve ${uyeler.size - 2} daha fazlası...` : ''} üyeler(üyelerin) \`${belirle.name}\` rolüne ait görev bilgileri temizleniyor...`)]})
            setTimeout(async () => {
                await Tasks.deleteOne({roleID: belirle.id})
                await modal.editReply({embeds: [new genEmbed().setDescription(`Başarıyla ${belirle} rolüne ait tüm görev verileri temizlendi ve kaldırıldı. ${guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
            }, 2000)
            uyeler.forEach(async (uye) => {
              await Tasks.findOneAndUpdate({ $pull: { Users: uye.id }})
              await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission": {
                Tagged: 0,
                Register: 0,
                Invite: 0,
                Staff: 0,
                completedMission: 0,
                CompletedStaff: false,
                CompletedInvite: false,
                CompletedAllVoice: false,
                CompletedPublicVoice: false,
                CompletedTagged: false,
                CompletedRegister: false,
              }}}, {upsert: true})
              await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})

          })
        } else if(guild.members.cache.get(getInput)) {
          let görevData = await Tasks.findOne({ roleID: belirle.roles.hoist ? belirle.roles.hoist.id : 0 }) || await Tasks.findOne({ roleID: belirle.roles.highest ? belirle.roles.highest.id : 0 })
          if(!görevData) {
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Belirtilen üyeye ait bir görev bulunamadı!` , ephemeral: true })
          }
          await Tasks.findOneAndUpdate({ $pull: { Users: belirle.id }})
          await Upstaffs.updateOne({_id: belirle.id}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
          }} }, {upsert: true})
           await Stats.updateOne({guildID: sistem.SERVER.ID, userID: belirle.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
           if(logKanal) await logKanal.send({embeds: [new genEmbed().setDescription(`${guild.emojiGöster(emojiler.Onay)} ${belirle} üyesinin <t:${String(Date.now()).slice(0, 10)}:R> ${uye} tarafından tüm görevleri temizlendi.`)]})
           await modal.reply({ephemeral: true, embeds: [new genEmbed().setDescription(`${guild.emojiGöster(emojiler.Onay)} Şuan da ${belirle} üyesine ait görev verileri temizleniyor...`)]})
           setTimeout(async () => {
               await modal.editReply({embeds: [new genEmbed().setDescription(`Başarıyla ${belirle} üyesine ait tüm görev verileri temizlendi. ${guild.emojiGöster(emojiler.Onay)}`)], ephemeral: true})
           }, 2000)
        
        }
      }
    })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let process = ["ver", "temizle", "listele"]
    let seçenek = args[0]
    let Row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Görev Oluştur/Güncelle")
        .setCustomId("setTask"),

        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Görev Temizle/Kaldır")
        .setCustomId("deleteTask"),

        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Görevleri Listele")
        .setCustomId("viewTasks")
 

    )
    message.reply({embeds: [new genEmbed().setDescription(`Aşağıda bulunan düğmeler ile görev sistemine ekleme, güncelleme ve silme işlemlerini gerçekleştirebilirsin.`)], components: [Row]}).then(async (msg) => {
      let filter = (i) => i.user.id == message.author.id
      let collector = msg.createMessageComponentCollector({filter: filter, max:1, time: 30000})
      collector.on('collect', async (i) => {

        if (i.customId === "deleteTask") {
            const deleteTasks = new ModalBuilder()
                .setCustomId('deleteTasks')
                .setTitle('Görev Temizle/Kaldır')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('tasksId')
                            .setLabel("Rol ID/Üye ID")
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Silincek görev rolü veya temizlencek üye bilgisi girin.')
                            .setRequired(true)
                    )
                );
        
            await i.showModal(deleteTasks);
        }
        if (i.customId === "viewTasks") {
          const onayEmoji = message.guild.emojis.cache.find(e => e.name === emojiler.Onay);
          message.react(onayEmoji ? onayEmoji.id : undefined).catch(err => {});
      
          await i.deferUpdate().catch(err => {});
      
          await Tasks.find({}).exec(async (err, res) => {
              if (err) return message.reply({ content: 'Hata: `Bazı hatalar oluştu :(`' });
              if (!res) return message.reply({ content: `${ayarlar.serverName} sunucusuna ait görev bilgisi veritabanında bulunamadı.` }).then(msg => {
                  setTimeout(() => {
                      msg.delete().catch(err => {})
                  }, 5000);
              });
      
              if (res && res.length <= 0) return message.reply({ content: `${ayarlar.serverName} sunucusuna ait görev bilgisi veritabanında bulunamadı.` }).then(msg => {
                  setTimeout(() => {
                      msg.delete().catch(err => {})
                  }, 5000);
              });
      
              let data = [["ID", "Rol İsmi", "Tüm Ses Saati", "Diğer Ses Saati", "Davet", "Taglı", "Yetkili", "Ödül"]];
              data = data.concat(res.map((value, index) => {
                  return [
                      `#${index + 1}`,
                      `${message.guild.roles.cache.get(value.roleID) ? message.guild.roles.cache.get(value.roleID).name : "@Rol Yok!"}`,
                      `${value.AllVoice} Saat`,
                      `${value.publicVoice} Saat`,
                      `${value.Invite}`,
                      `${value.Tagged}`,
                      `${value.Staff}`,
                      `${value.Reward}`,
                  ]
              }));
      
              let veriler = table.table(data, {
                  border: {
                      topBody: `─`,
                      topJoin: `┬`,
                      topLeft: `┌`,
                      topRight: `┐`,
      
                      bottomBody: `─`,
                      bottomJoin: `┴`,
                      bottomLeft: `└`,
                      bottomRight: `┘`,
      
                      bodyLeft: `│`,
                      bodyRight: `│`,
                      bodyJoin: `│`,
      
                      joinBody: `─`,
                      joinLeft: `├`,
                      joinRight: `┤`,
                      joinJoin: `┼`
                  },
                  drawHorizontalLine: (index, size) => {
                      return index === 0 || index === 1 || index === size;
                  }
              });
      
              message.channel.send({ content: `Aşağıda **${ayarlar.serverName}** sunucusuna ait aktif görevler listelenmektedir.` });
              splitAndSendMessages(veriler, 2000);
          });
      }
      
      function splitAndSendMessages(text, maxLength) {
          let lines = text.split("\n");
          let chunks = [];
          let currentChunk = [];
      
          lines.forEach(line => {
              if (currentChunk.join("\n").length + line.length > maxLength) {
                  chunks.push(currentChunk.join("\n"));
                  currentChunk = [];
              }
              currentChunk.push(line);
          });
      
          if (currentChunk.length > 0) {
              chunks.push(currentChunk.join("\n"));
          }
      
          chunks.forEach(chunk => {
              message.channel.send(`\`\`\`${chunk}\`\`\``);
          });
      }
      if (i.customId === "setTask") {
        const setTasks = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle('Görev Oluştur/Güncelle')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rolId')
                        .setLabel("Rol ID/İsmi")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Görev verilecek rol belirtin.')
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('ödül')
                        .setLabel("Görev Ödülü")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`${ayarlar.serverName} Parası ödülü belirleyin.`)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('otoYukseltimTuru')
                        .setLabel("Yükseltim Türü")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`AUTO/PERM/YAPAN/YAPMAYAN/TELAFI/MEETING`)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('t_selectInformationType')
                        .setLabel("Görev Süresi")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Görev süresini seçmelisin. Sınırsız için boş bırakın. Örn: 1d")
                        .setRequired(false)
                )
            );
    
        await i.showModal(setTasks);
    }
      })

      collector.on('end', (i, reason) => {
        msg.delete().catch(err => {})
        if(reason == "time") message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      })
    })
   
 }
};




