const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "git",
    Komut: ["git", "izinligit"],
    Kullanim: "izinligit @cartel/ID",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!message.member.voice.channel) return message.reply(`${cevaplar.prefix} Bir ses kanalında olman lazım.`).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (!uye) return message.reply(`${cevaplar.prefix} Bir üye belirtmelisin.`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.id === uye.id) return message.reply(`${cevaplar.prefix} Kendinin yanına da gitmezsin!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.voice.channel === uye.voice.channel) return message.reply(`${cevaplar.prefix} Belirttiğin üyeyle aynı kanaldasın!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (!member.voice.channel) return message.reply(`${cevaplar.prefix} Belirtilen üye herhangi bir ses kanalında değil!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (uye.user.bot) return message.reply(cevaplar.bot).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) || roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) {
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
        await message.member.voice.setChannel(uye.voice.channel.id).catch(err => {})
        return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.member} isimli yetkili ${uye} (\`${uye.voice.channel.name}\`) isimli üyenin odasına gitti!`)]}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500))
    }
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
    
    message.channel.send({content: `${uye.toString()}`, embeds: [embed.setDescription(`${uye}, ${message.author} adlı üye \`${uye.voice.channel.name}\` adlı odanıza gelmek istiyor.\nKabul ediyor musun?`)], components: [Row]}).then(async (msg) => {
        var filter = (i) => i.user.id == uye.id
        let collector = msg.createMessageComponentCollector({filter: filter, time: 30000})

        collector.on('collect', async (i) => {
            if(i.customId == "kabulet") {
                await i.deferUpdate().catch(err => {})
                await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.author}, ${uye} isimli üye senin odaya gelme isteğini kabul etti.`)], components: []}).catch(err => {})
                await message.member.voice.setChannel(uye.voice.channel.id).catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 12000);
            }
            if(i.customId == "reddet") {
                await i.deferUpdate().catch(err => {})
                await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${message.author}, ${uye} isimli üye senin odaya gelme isteğini reddetti!`)], components: []}).catch(err => {})
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
                .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            )  
            await msg.edit({content: `${message.member.toString()}`, embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${message.author}, ${uye} isimli üye tepki vermediğinden dolayı işlem iptal edildi.`)], components: [RowTwo]}).catch(err => {})
            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 12000);
        })
    })

    }
};