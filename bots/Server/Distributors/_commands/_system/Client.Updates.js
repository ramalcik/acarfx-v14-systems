const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, StringSelectMenuBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const GUARDS_SETTINGS = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const { genEmbed } = require('../../../../Global/Init/Embed')

let BOTS = global.allBots = client.allBots = []
const Discord = require("discord.js")
module.exports = {
    Isim: "bot",
    Komut: ["bot-dev","update-bots","botsu","keasy-bot","bot-setting","dev-discord","bots","botpp"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    let callbacks = require('../../../../Global/Settings/_system.json');

    // Bot Token's

let Stat = callbacks.TOKENS.Statistics
let Voucher = callbacks.TOKENS.Voucher
let Controller = sistem.TOKENS.CONTROLLER
let Sync = callbacks.TOKENS.SYNC
let SEC_MAIN = callbacks.TOKENS.SECURITY.MAIN
let SEC_ONE = callbacks.TOKENS.SECURITY.SEC_ONE
let SEC_TWO = callbacks.TOKENS.SECURITY.SEC_TWO
    // Bot Token's

let allTokens = [Stat, Voucher,Controller, Sync, SEC_MAIN, SEC_ONE, SEC_TWO]
let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SERVER.ID})
if(!guardSettings) await GUARDS_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$set: {"auditLimit": 10, auditInLimitTime: "2m"}}, {upsert: true})
allTokens.forEach(async (token) => {
    let botClient;
    if(callbacks.TOKENS.SECURITY.DISTS.includes(token) || SEC_TWO == token) {
        botClient = new Client({
            intents:  Object.keys(GatewayIntentBits),
            presence: { status: "invisible" },
          }); 
    } else {
        botClient = new Client({
            intents:  Object.keys(GatewayIntentBits),
            presence: {activities: [{name: sistem.botStatus.Name}], status: sistem.botStatus.Status}
          });

    }
      botClient.on("ready", async () => {  
          BOTS.push(botClient)
          let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SERVER.ID})
          }  
      })
      await botClient.login(token).catch(err => {
      })
})

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let callbacks = require('../../../../Global/Settings/_system.json');

        // Bot Token's
    let Req = callbacks.TOKENS.Requirements
    let Stat = callbacks.TOKENS.Statistics
    let Voucher = callbacks.TOKENS.Voucher
    let SEC_MAIN = callbacks.TOKENS.SECURITY.MAIN
    let SEC_ONE = callbacks.TOKENS.SECURITY.SEC_ONE
    let SEC_TWO = callbacks.TOKENS.SECURITY.SEC_TWO
    let SEC_THREE = callbacks.TOKENS.SECURITY.SEC_THREE
    let SEC_FOUR = callbacks.TOKENS.SECURITY.SEC_FOUR
    let DISTS = callbacks.TOKENS.SECURITY.DISTS
        // Bot Token's

    let allTokens = [Req, Stat, Voucher, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR]
    let pubTokens = [Req, Stat, Voucher, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR]
   
    let OWNBOTS = []

    BOTS.forEach(bot => {
        OWNBOTS.push({
            value: bot.user.id,
            emoji: { name: "♾️" },
            label: `${bot.user.username}`,
            description: `${bot.user.id}`
        })
    })
    let Row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("selectBot")
        .setPlaceholder("Güncellenmesini istediğiniz botu seçin.")
        .setOptions(
            ...[OWNBOTS]
        )
    )

    let msg = await message.channel.send({embeds: [new genEmbed().setColor("Random").setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: 'png'})}).setDescription(`Aşağıda sıralanmakta olan botların ismini, profil fotoğrafını, durumunu ve hakkındasını değişmesini istediğiniz bir botu seçiniz.`)],components: [Row]})
    const filter = i => i.user.id == message.member.id
    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })

    collector.on('collect', async (i) => {
        if(i.customId == "selectBot") {
            let type = i.values
            if(!type) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})

                let botId = i.values
                let botClient = BOTS.find(bot => bot.user.id == type)
                if(!botClient) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})
                let updateRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("selectAvatar")
                    .setEmoji("943286130357444608")
                    .setLabel("Profil Fotoğrafı Değişikliliği")
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("selectName")
                    .setEmoji("943290426562076762")
                    .setLabel("İsim Değişikliliği")
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("selectAbout")
                    .setEmoji("943290446329835570")
                    .setLabel("Hakkında Değişikliliği")
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("selectState")
                    .setEmoji("951514358377234432")
                    .setLabel("Durum Değişikliliği")
                    .setStyle(ButtonStyle.Secondary),
                )
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new genEmbed().setColor("White").setDescription(`${botClient.user} (**${botClient.user.username}**) isimli bot üzerinde yapmak istediğiniz değişikliliği seçiniz?`)], components: [
                    updateRow
                ]}).then(msg => {
                    const filter = i => i.user.id == message.member.id 
                    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })
                    collector.on("collect", async (i) => {
                        let botClient = BOTS.find(bot => bot.user.id == botId)
                        if(!botClient) return await i.reply({content: "Bir bot veya işlem bulunamadı!", ephemeral: true})
                        if(i.customId == "selectAbout" || i.customId == "selectState") {
                            await i.reply({content:`Şuan yapım aşamasında.`, ephemeral: true})
                        }
                        if(i.customId == "selectAvatar") {
                             msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.Icon)} ${botClient.user} isimli botun yeni profil resmini yükleyin veya bağlantısını girin. İşlemi iptal etmek için (**iptal**) yazabilirsiniz. (**Süre**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} Profil resmi değiştirme işlemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.avatarURL({extension: 'png'})
                                  let bekle = await message.reply(`Bu işlem biraz uzun sürebilir, Lütfen bekleyin...`)
                                   let isim = m.content || m.attachments.first().url
                                    if(!isim) {
                                        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                        msg.delete().catch(err => {});
                                        await i.reply({content: `${cevaplar.prefix} Profil resmi belirtilmediği için işlem iptal edildi.`, ephemeral: true})
                                        return;
                                    }
                                  botClient.user.setAvatar(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${message.member} tarafından ${botClient.user} isimli botun profil resmi değiştirildi.`).setThumbnail(botClient.user.avatarURL())]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla! ${botClient.user} isimli botun profil resmi güncellendi!`).setThumbnail(botClient.user.avatarURL())]}).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.username}**, Başarısız! profil resmi güncelleyebilmem için biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                        if(i.customId == "selectName") {
                            msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.Icon)} ${botClient.user} isimli botun yeni ismini belirtin. İşlemi iptal etmek için (**iptal**) yazabilirsiniz. (**Süre**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} İsim değiştirme işlemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.username
                                  let bekle = await message.reply(`Bu işlem biraz uzun sürebilir, Lütfen bekleyin...`)
                                  let isim = m.content
                                  botClient.user.setUsername(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${message.member} tarafından ${botClient.user} isimli botun ismi değiştirildi.\n**${eskinick}** \` ••❯ \` **${botClient.user.username}** olarak güncellendi.`)]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla! **${eskinick}** \` ••❯ \` **${botClient.user.username}** olarak değiştirildi.`)]}).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.username}**, Başarısız! isim değiştirebilmem için biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                    })
                })
   
        }
    })

    collector.on("end", async () => {
        msg.delete().catch(err => {})
    })
  }
};
