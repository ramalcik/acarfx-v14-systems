const { Client, Message } = require("discord.js");
const util = require("util")
const Game = require('../../../../Global/Plugins/Economy/_games/RPS')

const Discord = require("discord.js")
module.exports = {
    Isim: "taşkağıtmakas",
    Komut: ["taskağıtmakas","tkm"],
    Kullanim: "taşkağıtmakas <@cartel/ID> <Miktar>",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!uye) return message.reply(`${cevaplar.prefix} Savaşmak istediğiniz bir üyeyi belirtin!`).then(x => {
      message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      setTimeout(() => {
          x.delete()
      }, 7500);
  });
  if (uye.id === message.author.id) return message.reply(`${cevaplar.prefix} Kendi pipinle oynayamazsın :)`).then(x => {
      message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      setTimeout(() => {
          x.delete()
      }, 7500);
  });
  uye = message.guild.members.cache.get(uye.id)
      if (!args[1]) return message.reply(`${cevaplar.prefix} Lütfen bir miktar belirtin aksi taktirde oyuna başlayamazsınız.`).then(x => {
          message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
          setTimeout(() => {
              x.delete()
          }, 7500);
      });
      if (args[1] <= 0) returnmessage.reply(`${cevaplar.prefix} Girdiğiniz miktar lütfen sıfırdan büyük olmalıdır.`).then(x => {
          message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
          setTimeout(() => {
              x.delete()
          }, 7500);
      });
    let data_1 = await client.Economy.viewBalance(message.member.id, 1)
    let data_2 = await client.Economy.viewBalance(uye.id, 1)
    if (data_1 > args[1] && data_2 > args[1]) { 
      await Game({
        message: message,
        opponent: uye,
        embed: {
          title: 'xd',
          description: 'Aşağıda ki elementlerden birini seçin! Taş mı? Kağıt mı? Makas mı?',
          color: '#5865F2',
              footer: 'xd',
          timestamp: false
        },
        buttons: {
          rock: 'Taş',
          paper: 'Kağıt',
          scissors: 'Makas',
          accept: 'Kabul Et',
          deny: 'Kabul Etme',
        },
        ödül: args[1] * 2,
        bahis: args[1],
        parabirim: ayarlar.serverName,
        time: 60000,
        acceptMessage:
          `<@{{opponent}}> Merhaba!
<@{{challenger}}> isimli üye seni \`{{bahis}} ${ayarlar.serverName} Parası\` değerinde Taş Kağıt ve Makas oyununa davet ediyor. Kabul etmek istiyorsan **hemen tıkla**!`,
        winMessage: `Oyun sona erdi, oyunun kazananı <@{{winner}}> oldu!\nOyundan tam tamına "${args[1] * 2} ${ayarlar.serverName} Parası" değerinde ödül kazandı!`,
        drawMessage: `Berabere kalındı!
Berabere kalındığından dolayı ${message.member} ve ${uye} üyelerinin \`${args[1]} ${ayarlar.serverName} Parası\` her ikisinede tekrardan verildi.`,
        endMessage: "<@{{opponent}}> zamanında cevap vermedi. Oyun bitirildi ve paralar iade edildi!",
        timeEndMessage:
          "Zamanında cevap verilmediği için, zaman aşımına uğradı!",
        cancelMessage:
          '<@{{opponent}}> isimli üye seninle "Taş Kağıt ve Makas" oyununu oynamayı reddetti!',
        choseMessage: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla elementiniz seçildi! (**Element**: {{emoji}})`,
        noChangeMessage: 'Seçiminizi değiştirmek için artık çok geç!',
        othersMessage: 'Sadece {{author}} üye(ler) kullanabilir!',
        returnWinner: false
      });
    } else return message.reply(`${cevaplar.prefix} Belirtiğiniz üyenin veya sizin belirttiğiniz miktarda parası bulunamadı.`).then(x => {
      message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      setTimeout(() => {
          x.delete()
      }, 7500);
  });
}
};