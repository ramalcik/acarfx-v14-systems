const { Client, Message, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const moment = require("moment");
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
require("moment-timezone");
// ../../Assets/
const Discord = require("discord.js")
module.exports = {
    Isim: "coinflip",
    Komut: ["cf", "bahis"],
    Kullanim: "coinflip <100-500000-all>",
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
    let embed = new genEmbed()
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
    if(Coin < Miktar) return message.reply(`${cevaplar.prefix} Belirtiğiniz miktar kadar yeterince ${ayarlar.serverName} Parası olmadığından dolayı bahse giremezsiniz.`).then(x => {
message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
setTimeout(() => {x.delete().catch(err => {})}, 5000)
})
let mk;
await client.Economy.updateBalance(uye.id, Number(Miktar), "remove", 1)  
mk = Miktar * 2
mk = mk.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
message.reply({content: `**Bahis Devam Ediyor!** ${message.guild.emojiGöster("cartel_cf")}
\` ${mk} ${ayarlar.serverName} Parası \` için bahis döndürülüyor!

Belirlenen Miktar: \` ${Miktar.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \``}).then(msg => {
        setTimeout(async () => {
            let rnd = Math.floor(Math.random() * 2), result;
            if(rnd == 1){
                result = "kazandın";
                Miktar = Number(Miktar);
                let coin = Miktar + Miktar;
                await client.Economy.updateBalance(uye.id, Number(coin), "add", 1)
            }
            else result = "kaybettin";
            message.react(rnd == 1 ?  message.guild.emojiGöster(emojiler.Onay) : message.guild.emojiGöster(emojiler.Iptal)).catch(err => {})
            let cc = Miktar*2;
            msg.edit({content: `**Bahis Bitti!** ${rnd == 1 ? message.guild.emojiGöster("cartel_cfwin") : message.guild.emojiGöster("cartel_cflose")}
\` ${cc.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \` için bahis döndürülme durdu${rnd == 1 ? " ve kazandın" : " ve kaybettin"}!

${rnd == 1 ? `:tada: **Tebrikler!** Bu oyunu kazandın!` : `${message.guild.emojiGöster(emojiler.Iptal)} **Kaybettin!** Bu oyunu kazanamadın!`}
${rnd == 1 ? `Kazanılan Miktar: \` ${cc.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \`` : `Kaybedilen Miktar: \` ${Miktar.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${ayarlar.serverName} Parası \``}`}).catch(err => {});    
        }, 4000);
    }).catch(err => {});

    }
};

