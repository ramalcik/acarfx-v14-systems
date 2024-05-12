const { Client, Message, EmbedBuilder} = require("discord.js");
const moment = require("moment");
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
require("moment-timezone");
const Beklet = new Set();

const Discord = require("discord.js")
module.exports = {
    Isim: "slots",
    Komut: ["slot", "s"],
    Kullanim: "slots <100-250000-all>",
    Aciklama: "",
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
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    if(!kanallar.coinChat.some(x => message.channel.id == x) && !ayarlar.staff.includes(message.member.id)) return message.reply(`${cevaplar.prefix} Sadece ${kanallar.coinChat.map(x => message.guild.channels.cache.get(x)).join(",")} kanalların da oynayabilirsin.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {x.delete()}, 5000)
        })
    if(Beklet.has(message.author.id)) return message.reply(`${cevaplar.prefix} \`Flood!\` Lütfen bir kaç saniye sonra tekrar oynamayı deneyin.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
    let embed = new genEmbed()
    let uye = message.guild.members.cache.get(message.member.id);
    let Coin = await client.Economy.viewBalance(uye.id, 1)
    let Miktar = Number(args[0]);
    if(args[0] == "all") {
        if(Coin >= 500000) Miktar = 500000
        if(Coin < 500000) Miktar = Coin
        if(Coin <= 0) Miktar = 10
    }
    Miktar = Miktar.toFixed(0);
    if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Miktar yerine harf kullanmamayı tavsiye ederim.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
    if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Göndermek istediğiniz miktar, birden küçük olamaz.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
    if(Miktar > 500000) return message.reply(`${cevaplar.prefix} Bahise en fazla \`250.000\` ${ayarlar.serverName} Parası ile girilebilir.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
    if(Miktar < 10) return message.reply(`${cevaplar.prefix} Bahise en az \`10\` ${ayarlar.serverName} Parası ile girebilirsiniz.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
    if(Coin < Miktar) return message.reply(`${cevaplar.prefix} Belirtiğiniz miktar kadar yeterince ${ayarlar.serverName} Parası olmadığından dolayı bahse giremezsiniz.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete()}, 5000)
})
let Kıbrıscartel = [message.guild.emojiGöster("cartel_pat"),message.guild.emojiGöster("cartel_heart"),message.guild.emojiGöster("cartel_vis")];
var SlotOne = Kıbrıscartel[Math.floor(Math.random() * 3)]
var SlotTwo = Kıbrıscartel[Math.floor(Math.random() * 3)]
var SlotThree = Kıbrıscartel[Math.floor(Math.random() * 3)]

    await client.Economy.updateBalance(uye.id, Number(Miktar), "remove", 1)
    Beklet.add(message.author.id);
    let cc = Miktar * 4;
    message.reply({content: `
\`___SLOTS___\`
  ${message.guild.emojiGöster("cartel_slot")} ${message.guild.emojiGöster("cartel_slot")} ${message.guild.emojiGöster("cartel_slot")}
\`|         |\`
\`|         |\`
Belirlenen Miktar: \` ${Miktar.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \`
Kazanılacak Miktar: \` ${cc.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \``}).then(msg => {
        if (SlotOne === SlotTwo && SlotOne === SlotThree) {
        setTimeout(async () => {
            Miktar = Number(Miktar);
            let coin = Miktar * 4;
            await client.Economy.updateBalance(uye.id, Number(coin), "add", 1)
            msg.edit({content: `\`___SLOTS___\`
  ${SlotOne} ${SlotTwo} ${SlotThree}
\`|         |\`
\`|         |\`
:tada: **Tebrikler!** Bu oyunu kazandınız! 
Kazanılan Ödül: \` ${Miktar.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası => [ 4x ] => +${coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \``});    
            Beklet.delete(message.author.id);
            message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            }, 2500);
        } else {
            setTimeout(async () => {
                let coin = Miktar * 4;
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            msg.edit({content: `\`___SLOTS___\`
  ${SlotOne} ${SlotTwo} ${SlotThree}
**\`|         |\`**
**\`|         |\`**
${message.guild.emojiGöster(emojiler.Iptal)} **Kaybettin!** Bu oyunu kazanamadın!
Kaybedilen Miktar: \` -${Miktar.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \``});
            Beklet.delete(message.author.id);
            }, 2500);
        }
        });
    }
};

