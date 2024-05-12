const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "çek",
    Komut: ["çek", "izinliçek","cek","izinlicek"],
    Kullanim: "izinliçek @cartel/ID",
    Aciklama: "Belirlenen üyeye izin ile yanına gider.",
    Kategori: "diğer",
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
    let embed = new genEmbed()
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!message.member.voice.channel) return message.reply(`${cevaplar.prefix} Bir ses kanalında olman lazım.`).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (!member) return message.reply(`${cevaplar.prefix} Bir üye belirtmelisin.`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.id === member.id) return message.reply(`${cevaplar.prefix} Kendinin çekemezsin!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.voice.channel === member.voice.channel) return message.reply(`${cevaplar.prefix} Belirttiğin üyeyle aynı kanaldasın!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (!member.voice.channel) return message.reply(`${cevaplar.prefix} Belirtilen üye herhangi bir ses kanalında değil!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (member.user.bot) return message.reply(cevaplar.bot).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (message.member.roles.highest.position < uye.roles.highest.position) { 
        let Row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("kabulet")
            .setLabel("Kabul Et")
            .setEmoji(message.guild.emojiGöster(emojiler.Onay).id)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("reddet")
            .setLabel("Reddet")
            .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
            .setStyle(ButtonStyle.Danger)
        )   
        message.channel.send({content: `${uye.toString()}`, embeds: [embed.setDescription(`${member}, ${message.author} adlı üye \`${message.member.voice.channel.name}\` odasına seni çekmek istiyor.\nKabul ediyor musun?`)], components: [Row]}).then(async (msg) => {
            var filter = (i) => i.user.id == uye.id
            let collector = msg.createMessageComponentCollector({filter: filter, time: 30000})
            collector.on('collect', async (i) => {
                if(i.customId == "kabulet") {
                    await i.deferUpdate().catch(err => {})
             
                    await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye}, isimli üye senin odaya çekme isteğini kabul etti.`)], components: []}).catch(err => {})
                    await uye.voice.setChannel(message.member.voice.channel.id).catch(err => {});
                    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                    setTimeout(() => {
                        msg.delete().catch(err => {})
                    }, 12000);
                }
                if(i.customId == "reddet") {
                    await i.deferUpdate().catch(err => {})
                   
                    await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye}, isimli üye senin odaya çekme isteğini reddetti!`)], components: []}).catch(err => {})
                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                    setTimeout(() => {
                        msg.delete().catch(err => {})
                    }, 12000);
                }
            })
            collector.on('end', async (i) => {
                i.delete()
                let RowTwo = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("kabulet")
                    .setLabel("Zaman Aşımı!")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                )  
                await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${message.author}, ${uye} isimli üye tepki vermediğinden dolayı işlem iptal edildi.`)], components: [RowTwo]}).catch(err => {})
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 12000);
            })
        })
    } else {
        if (roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) {
            await uye.voice.setChannel(message.member.voice.channel.id).catch(err => {});
            message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.member} isimli yetkili ${member} isimli üyeyi \`${message.member.voice.channel.name}\` isimli odaya çekti!`)]}).then(x => setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500))
        }
    }
    }
};