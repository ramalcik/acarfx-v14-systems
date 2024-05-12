const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Upstaff = require('../../../../Global/Databases/Schemas/Client.Users')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const Discord = require("discord.js")
module.exports = {
    Isim: "bio",
    Komut: ["biyografi","bio","biography"],
    Kullanim: "biyografi <[En az: 5, En fazla: 120]>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
    Kategori: "eco",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
        let ownedbio = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("değiştir")
            .setLabel(await client.Economy.viewBalance(message.member.id, 0) || 0 >= 1 ? "💭 Biyografi Güncelleme" : "Güncelleyemezsin!")
            .setDisabled(await client.Economy.viewBalance(message.member.id, 0) || 0 >= 1 ? false : true)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("sat")
            .setLabel("💵 2 Altın'a Geri Sat")
            .setStyle(ButtonStyle.Secondary)
        )
        let acheck = await Upstaff.findOne({_id: message.member.id})
        if(acheck && acheck.Biography) {

            message.reply({embeds: [new genEmbed().setDescription(`Daha önce biyografi satın almışsın! :tada:
Şuan ki biyografin: \`${acheck.Biography}\``).setColor("Yellow").setAuthor({ name: message.member.user.usernam, iconURL: message.member.user.avatarURL({extension: 'png'})})], components: [ownedbio]}).then(msg => {
                var filter = (i) => i.user.id == message.member.id && i.customId == "sat" || i.customId == "değiştir"
                let collector = msg.createMessageComponentCollector({filter: filter, time: 60000})
                collector.on('collect', async (i) => {
                    if(i.customId == "sat") {
                        await Upstaff.updateOne({_id: message.member.id}, { $inc: {"Gold": 2}, $unset: { "Biography": "xd" }}, {upsert: true})
                        await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **2 Altın** fiyatına biygorafini sattın.`, ephemeral: true})
                        msg.delete().catch(err => {})
                        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                    }
                    if(i.customId == "değiştir") {
                        let goldcheck = await client.Economy.viewBalance(message.member.id, 0) || 0
                        if(goldcheck < 1) return msg.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),i.reply({content: `${cevaplar.prefix} **Başarısız!** Biyografini değiştirmeye yeteri kadar altın bulunamadı.`, ephemeral: true}).catch(err => {});
                        msg.delete().catch(err => {})
                        message.channel.send({embeds: [new genEmbed().setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({extension: 'png'})}).setColor("Random").setDescription(`${message.guild.emojiGöster(emojiler.Tag)} Lütfen yeni bir biyografi belirleyiniz. En az 5 karakter en fazla 120 karakter olmak üzere.`)]}).then(mesaj => {
                            var filter = (m) => m.author.id == message.member.id
                            let collector = mesaj.channel.createMessageCollector({filter: filter, time: 60000, max: 1, errors: ["time"]})
                            collector.on('collect', async (m) => {
                                if(m.content == "iptal") return mesaj.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),m.reply({content: `${cevaplar.prefix} İşlem istek üzerine iptal edildi.`, ephemeral: true}).catch(err => {});
                                let goldcheck = await client.Economy.viewBalance(message.member.id, 0) || 0
                                if(goldcheck < 1) return mesaj.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),m.reply({content: `${cevaplar.prefix} **Başarısız!** Biyografini değiştirmeye yeteri kadar altın bulunamadı.`, ephemeral: true}).catch(err => {});
                                if(m.content.length < 5 || m.content.length > 120) return mesaj.delete(),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined),mreply({content: `${cevaplar.prefix} **Başarısız!** Çok kısa veya çok uzun bir biyografi seçildi ve işlem iptal edildi.`, ephemeral: true}).catch(err => {});
                                mesaj.delete().catch(err => {})
                                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                                await Upstaff.updateOne({_id: message.member.id}, {$inc: {"Gold": -1}, $set: { "Biography": `${m.content}` }}, {upsert: true})
                                m.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla yeni biyografiniz \`${m.content}\` olarak belirlendi.`, ephemeral: true}).catch(err => {})
                            })
                        })
                    }
                })
            })

            return;
        }
        let gold = await client.Economy.viewBalance(message.member.id, 0) || 0
        if(gold < 4) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} **Başarısız!** Gereken **5 Altın** bulunamadığından satın alamazsın!`, ephemeral: true}).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        let bio = args.splice(0).join(" ")
        if(!bio) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} **Başarısız!** Bir biyografi belirlenmedi! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true}).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        if(bio.length > 120) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} **Başarısız!** Çok uzun bir biyografi mesajı! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true}).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        if(bio.length < 5) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} **Başarısız!** Çok kısa bir biyografi mesajı! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true}).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 7500);
        });
        await Upstaff.updateOne({_id: message.member.id}, { $inc: {"Gold": -5}, $set: { "Biography": bio }}, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **5 Altın** karşılığı biyografin \`${bio}\` olarak ayarlandı.`)]}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 15000);
        })

  }
};



function secretOluştur(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }