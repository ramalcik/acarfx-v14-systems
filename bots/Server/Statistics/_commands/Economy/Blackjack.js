const { Client, Message } = require("discord.js");
const util = require("util")
const Game = require('../../../../Global/Plugins/Economy/_games/Blackjack/index')
const Discord = require("discord.js")
module.exports = {
    Isim: "bj",
    Komut: ["blackjack","bj21"],
    Kullanim: "blackjack <100-500000-all>",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    Kategori: "eco",
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
    if(!kanallar.coinChat.some(x => message.channel.id == x) && !ayarlar.staff.includes(message.member.id)) return message.reply(`${cevaplar.prefix} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete()}, 5000)
    })
    let uye = message.guild.members.cache.get(message.member.id);
    let Coin = await client.Economy.viewBalance(uye.id, 1)
    let Miktar = Number(args[0]);
    if(args[0] == "all") {
        if(Coin >= 500000) Miktar = 500000
        if(Coin < 500000) Miktar = Number(Coin)
        if(Coin <= 0) Miktar = 10
    }
    if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Miktar yerine harf kullanmamayı tavsiye ederim.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete().catch(err => {})}, 5000)
    })
    if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz miktar, birden küçük olamaz.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete().catch(err => {})}, 5000)
    })
    if(Miktar > 500000) return message.reply(`${cevaplar.prefix} Bahise en fazla \`250.000\` ${ayarlar.serverName} Parası ile girilebilir.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete().catch(err => {})}, 5000)
    })
    if(Miktar < 10) return message.reply(`${cevaplar.prefix} Bahise en az \`10\` ${ayarlar.serverName} Parası ile girebilirsiniz.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete().catch(err => {})}, 5000)
    })
    if(Coin < Miktar) return message.reply(`${cevaplar.prefix} Yeterli "${ayarlar.serverName} Parası" bulunamadı.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete().catch(err => {})}, 5000)
    })
    await client.Economy.updateBalance(uye.id, Number(Miktar), "remove", 1)  
    let Ödül = Number(Miktar * 2)
    let game = await Game(message, { buttons: true, transition: "edit", bahis: Miktar, odul: Ödül, doubleodul: Number(Ödül * 2) }) 
    let puan = 0
    if(game.ycard) game.ycard.forEach(c => {
        puan += c.value
    })
    if(game.result.includes("DOUBLE WIN") || game.result == "BLACKJACK") {
        await client.Economy.updateBalance(message.member.id, Number(Ödül * 2), "add", 1)
    } else if(game.result.includes("WIN") || game.result == "SPLIT LOSE-WIN" || game.result == "SPLIT WIN-LOSE" || game.result == "SPLIT LOSE-DOUBLE WIN" || game.result == "SPLIT TIE-DOUBLE WIN" || game.result == "SPLIT DOUBLE WIN-TIE" || game.result == "SPLIT DOUBLE WIN-LOSE" || game.result == "SPLIT WIN-TIE" || game.result == "SPLIT TIE-WIN") {
        await client.Economy.updateBalance(message.member.id, Number(Ödül), "add", 1)
    } else if(game.result.includes("INSURANCE")) {
        await client.Economy.updateBalance(message.member.id, Number(Miktar), "add", 1)
    } else if(game.result.includes("TIE")) {
        await client.Economy.updateBalance(message.member.id, Number(Miktar), "add", 1)
    } else if(game.result == "CANCEL" || game.result == "TIMEOUT")  {
      //  await client.Economy.updateBalance(message.member.id, Number(Miktar), "add", 1)
    }
}
};