const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Coins = require('../../../../Global/Databases/Schemas/Client.Users');
let zaman = new Map();
let bugDeneme = new Map()
const Discord = require("discord.js");
const { cartel } = require("../../../../Global/Clients/Global.Clients");
module.exports = {
    Isim: "bozdur",
    Komut: ["döviz","doviz","çevir","cevir"],
    Kullanim: "doviz <Altın/Para>",
    Aciklama: "",
    Kategori: "eco",
    Extend: true,
    
   /**
   * @param {cartel} client 
   */
  onLoad: function (client) {
        client.dovizAltın = Math.floor(Math.random() * 3000) + 893
        client.eskiDovizAltın = client.dovizAltın - 854
        var CronJob = require('cron').CronJob
        let dovizCheck = new CronJob('0 0 * * *', async function() { 
            let guild = client.guilds.cache.get(sistem.SERVER.ID);
            client.eskiDovizAltın = client.dovizAltın
            client.dovizAltın = Math.floor(Math.random() * 3000) + 893
            let chatKanalı = guild.kanalBul(kanallar.chatKanalı)
            if(kanallar.chatKanalı && chatKanalı) {
                chatKanalı.send(`:tada: **${ayarlar.serverName} Dovizden Haber! (${client.eskiDovizAltın < client.dovizAltın ? "Yeniden yükselen Altın": "Düşüyor gönlümün efendisi"})**
${client.eskiDovizAltın < client.dovizAltın ? `:chart: **Altının** değeri güncellendi! **${client.eskiDovizAltın} ${ayarlar.serverName}** Parasından, **${client.dovizAltın} ${ayarlar.serverName}** Parasına Yükseldi!
`: `:chart_with_downwards_trend:  **Altının** değeri güncellendi! **${client.eskiDovizAltın} ${ayarlar.serverName}** Parasından, **${client.dovizAltın} ${ayarlar.serverName}** Parasına Düştü!`}
**Hemen Altınlarını Çevir!** Çevirmek için ${kanallar.coinChat.map(x => guild.channels.cache.get(x))} kanalından \`${sistem.botSettings.Prefixs[0]}doviz\` komutunu kullanabilir ve çevirdiğin altını anında harcamak için oyun komutlarımıza "\`${sistem.botSettings.Prefixs[0]}yardım\` > Ekonomi Komutları" kısmından bakabilirsiniz.`)
            } 
            console.log("Doviz Güncellendi!")
        }, null, true, 'Europe/Istanbul')
        dovizCheck.start()
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
      if(bugDeneme.get(message.member.id)) return message.reply({content: `Şuanda aktif bir "Doviz" panelizin açık! ${cevaplar.prefix}`}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 5000);
      });
      bugDeneme.set(message.member.id, true)
      let uye = message.guild.members.cache.get(message.member.id);
      let embed = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})})
    let para = await client.Economy.viewBalance(uye.id, 1)
    let altın = await client.Economy.viewBalance(uye.id, 0)
    let Altıncık = Number(client.dovizAltın)
    let Paracık = 1
    let Row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("gold")
        .setLabel(altın < Paracık ? "Yetersiz Altın" : `1 Altın 💱 ${client.dovizAltın} ${ayarlar.serverName} Parası`)
        .setDisabled(altın < Paracık ? true : false)
        .setEmoji(message.guild.emojiGöster(emojiler.Görev.Altın).id)
        .setStyle(altın < Paracık ? ButtonStyle.Danger : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("topluPara")
        .setLabel(altın < Paracık ? "Yetersiz Altın" : `Tüm Altını Paraya Çevir!`)
        .setDisabled(altın < Paracık ? true : false)
        .setEmoji(message.guild.emojiGöster(emojiler.Görev.Para).id)
        .setStyle(altın < Paracık ? ButtonStyle.Danger : ButtonStyle.Secondary),
    )
     let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("para")
        .setLabel(para < Altıncık ? "Yetersiz Para" : `${client.dovizAltın} ${ayarlar.serverName} Parası 💱 1 Altın`)
        .setDisabled(para < Altıncık ? true : false)
        .setEmoji(message.guild.emojiGöster(emojiler.Görev.Para).id)
        .setStyle(para < Altıncık ? ButtonStyle.Danger : ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("topluAltın")
        .setLabel(para < Altıncık ? "Yetersiz Para" : `Tüm Paranı Altına Çevir!`)
        .setDisabled(para < Altıncık ? true : false)
        .setEmoji(message.guild.emojiGöster(emojiler.Görev.Altın).id)
        .setStyle(para < Altıncık ? ButtonStyle.Danger : ButtonStyle.Secondary),
    )

    message.reply({components: [Row2, Row] ,embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`**Merhaba!** __${ayarlar.serverName}__ Doviz işlemleri menüsüne hoş geldiniz.
**${ayarlar.serverName} Doviz**'de gün içerisinde artan ve çıkan altın arttırımlarını buradan dönüştürebilir veya da işlemde bulunabilirsiniz. :currency_exchange:
Şuan ki duruma göre 1 Altın, **${client.dovizAltın} ${ayarlar.serverName} Parasına** eş değer olarak kabul edildi!

${client.eskiDovizAltın < client.dovizAltın ? `**Altının** değeri: 
**${client.eskiDovizAltın} ${ayarlar.serverName}** Parasından
💹 
**${client.dovizAltın} ${ayarlar.serverName}** Parasına Yükselmiş!
`: `
**Altının** değeri: 
**${client.eskiDovizAltın} ${ayarlar.serverName}** Parasından 
📉 
**${client.dovizAltın} ${ayarlar.serverName}** Parasına Düşmüş!`}
`)]}).then(async (msg) => {
    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 1, time: 30000 })

    collector.on('collect', async i => { 
        if(i.customId == "para") {
            if (zaman.get(message.author.id) >= 1) return msg.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),i.reply({content: `${cevaplar.prefix} Doviz işlemleri sadece **15 Saniye** aralığla yapılabilir. **Lütfen Daha Sonra Tekrar Deneyin!**`, ephemeral: true})
            await client.Economy.updateBalance(uye.id, Altıncık, "remove", 1)
            await client.Economy.updateBalance(uye.id, Paracık, "add", 0)
            await Coins.updateOne({_id: uye.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: 1, Tarih: Date.now(), Islem: "Altın (Dönüştürülen Para)" } }}, {upsert: true})
            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            msg.delete().catch(err => {})
            await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${Altıncık} ${ayarlar.serverName} Parası => ${Paracık.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} Altın\` olarak doviz kuru tarafıyla dönüştürüldü.`)]})
            zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
            bugDeneme.delete(message.member.id)
            setTimeout(() => {
                zaman.delete(message.author.id)
            }, 1000 * 15 * 1 * 1)
        }
        if(i.customId == "gold") {
            if (zaman.get(message.author.id) >= 1) return msg.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),i.reply({content: `${cevaplar.prefix} Doviz işlemleri sadece **15 Saniye** aralığla yapılabilir. **Lütfen Daha Sonra Tekrar Deneyin!**`, ephemeral: true})
            await client.Economy.updateBalance(uye.id, Paracık, "remove", 0)
            await client.Economy.updateBalance(uye.id, Altıncık, "add", 1)
            await Coins.updateOne({_id: uye.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: Number(Altıncık), Tarih: Date.now(), Islem: "Para (Dönüştürülen Altın)" } }}, {upsert: true})
            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            msg.delete().catch(err => {})
            await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${Paracık.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} Altın => ${Altıncık} ${ayarlar.serverName} Parası\` olarak doviz kuru tarafıyla dönüştürüldü.`)]})
            zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
            bugDeneme.delete(message.member.id)
            setTimeout(() => {
                zaman.delete(message.author.id)
            }, 1000 * 15 * 1 * 1)
        }
        if(i.customId == "topluPara") {    
            if (zaman.get(message.author.id) >= 1) return msg.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),i.reply({content: `${cevaplar.prefix} Doviz işlemleri sadece **15 Saniye** aralığla yapılabilir. **Lütfen Daha Sonra Tekrar Deneyin!**`, ephemeral: true})
            let adamPara = para
            let adamAltın = altın
            let dovizAltın = Altıncık
            let verilcekPara = Math.floor(adamAltın * dovizAltın)
            let alıncakAltın = altın
            await client.Economy.updateBalance(uye.id, Number(alıncakAltın), "remove", 0)
            await client.Economy.updateBalance(uye.id, Number(verilcekPara), "add", 1)
            await Coins.updateOne({_id: uye.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: verilcekPara, Tarih: Date.now(), Islem: `Para (Toplu Doviz) [${alıncakAltın} Altın]` } }}, {upsert: true})
            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            msg.delete().catch(err => {})
            await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${altın.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} Altın => ${verilcekPara} ${ayarlar.serverName} Parası\` olarak doviz kuru tarafıyla dönüştürüldü.`)]})
            zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
            bugDeneme.delete(message.member.id)
            setTimeout(() => {
                zaman.delete(message.author.id)
            }, 1000 * 15 * 1 * 1)
        }

        if(i.customId == "topluAltın") {    
            if (zaman.get(message.author.id) >= 1) return msg.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),i.reply({content: `${cevaplar.prefix} Doviz işlemleri sadece **15 Saniye** aralığla yapılabilir. **Lütfen Daha Sonra Tekrar Deneyin!**`, ephemeral: true})
            let adamPara = para
            let adamAltın = altın
            let dovizAltın = Altıncık
            let verilcekPara = Math.floor(adamPara / dovizAltın)
            let alıncakAltın = adamAltın
            await client.Economy.updateBalance(uye.id, Number(adamPara), "remove", 1)
            await client.Economy.updateBalance(uye.id, Number(verilcekPara), "add", 0)
            await Coins.updateOne({_id: uye.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: verilcekPara, Tarih: Date.now(), Islem: `Altın (Toplu Doviz) [${alıncakAltın} Para]` } }}, {upsert: true})
            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            msg.delete().catch(err => {})
            await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${para.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası => ${verilcekPara} Altın\` olarak doviz kuru tarafıyla dönüştürüldü.`)]})
            zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
            bugDeneme.delete(message.member.id)
            setTimeout(() => {
                zaman.delete(message.author.id)
            }, 1000 * 15 * 1 * 1)
        }
    })
    collector.on("end", i => {
        msg.delete().catch(err => {})
        bugDeneme.delete(message.member.id)
    })
    })
  }
};