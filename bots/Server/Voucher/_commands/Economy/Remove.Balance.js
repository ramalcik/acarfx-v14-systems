const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Coins = require('../../../../Global/Databases/Schemas/Client.Users');
const Discord = require("discord.js")
module.exports = {
    Isim: "removebalance",
    Komut: ["balremove","bal-remove","ballrev","coinsil"],
    Kullanim: "removebalance <Altın/Para> <@cartel/ID> <Miktar>",
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
    let embed = new genEmbed()
    let uye = message.guild.members.cache.get(message.member.id);
    let Coin = 0
    if(!ayarlar.staff.includes(message.member.id)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!args[0]) return message.reply(`${cevaplar.prefix} Lütfen hangi birimden geri alacağını belirt. (Örn: \`${sistem.botSettings.Prefixs[0]}removebalance <Altın/Para> <@cartel/ID> <Miktar>\` )`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    if(args[0] == "Para" || args[0] == "para") {
        Coin = await client.Economy.viewBalance(uye.id, 1)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`${cevaplar.prefix} Geri almak istediğiniz bi üyeyi belirtin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Geri almak istediğiniz miktarı rakam olarak girin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Geri alınacak rakam birden küçük veya sıfır olamaz.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        await client.Economy.updateBalance(Gönderilen.id, Miktar, "remove", 1)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Giden Para" } }}, {upsert: true})
        await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${Gönderilen} üyesine başarıyla \`${Miktar}\` ${ayarlar.serverName} Parasını geri aldın.`)]})
        return;
    } else if(args[0] == "Altın" || args[0] == "altın") {
        Coin = await client.Economy.viewBalance(uye.id, 0)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`${cevaplar.prefix} Geri almak istediğiniz bi üyeyi belirtin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`${cevaplar.prefix} Geri almak istediğiniz miktarı rakam olarak girin.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`${cevaplar.prefix} Geri alınacak rakam birden küçük veya sıfır olamaz.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        await client.Economy.updateBalance(Gönderilen.id, Miktar, "remove", 0)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Giden Altın" } }}, {upsert: true})
        await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${Gönderilen} üyesine başarıyla \`${Miktar}\` ${message.guild.emojiGöster(emojiler.Görev.Altın)} geri aldın.`)]})
        return;
    
    }
    return message.reply(`${cevaplar.prefix} Lütfen hangi birimden geri alacağını belirt. (Örn: \`${sistem.botSettings.Prefixs[0]}removebalance <Altın/Para> <@cartel/ID> <Miktar>\` )`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
  }
};