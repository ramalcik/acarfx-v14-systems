
const { Client, Message, AttachmentBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const util = require("util")
const Stats = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const ms = require('ms')
const moment = require('moment')
const { Canvas } = require('canvas-constructor');
const {
    loadImage
} = require('canvas');
const {
    join
} = require("path");  
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
    Isim: "toplevel",
    Komut: ["topseviye", "top-level","topseviye"],
    Kullanim: "toplevel",
    Aciklama: "",
    Kategori: "-",
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
        let Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("SES")
            .setEmoji("1004426555390435468")
            .setLabel("Seviye Sıralaması")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
            new ButtonBuilder()
            .setCustomId("mesaj")
            .setEmoji("1000142003729874975")
            .setLabel("Genel İstatistik Sıralaması")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false)
        )

        let msg = await message.reply({content: `Top Ses ve metin seviye sıralaması yükleniyor... Bu işlem biraz uzayabilir.`});

        let Stat = await Stats.find({})

        let data = [
        ]

        Stat
        .filter(x => message.guild.members.cache.get(x.userID) && !message.guild.members.cache.get(x.userID).user.bot)
        .map(x => data.push({id: x.userID, ses: x.voiceLevel, mesaj: x.messageLevel, xp: Number(x.messageXP + x.voiceXP)}))
        data = data.sort((a, b) => Number(b.xp) - Number(a.xp)).slice(0, 10)
        let back = await loadImage(`../../Assets/img/back.png`);
        let one = await loadImage("../../Assets/img/one.png"); 
        let two = await loadImage("../../Assets/img/two.png");  
        let three = await loadImage("../../Assets/img/three.png");      
        let icon = await loadImage(`../../Assets/img/voice.png`)
        let icon2 = await loadImage("../../Assets/img/chat.png")
        let image = new Canvas(697, data.length * 59)
        let start = 30
        let bstart = 0
        for (let i = 0; i < data.length; i++) {
            let uye = message.guild.members.cache.get(data[i].id)
            let avatar = await loadImage(uye.user.avatarURL({format: "jpg"}) ? uye.user.avatarURL({format: "jpg"}) : "https://cdn.discordapp.com/attachments/990322473750917120/1005299390921064498/aotNervousEren.png");
            image.printRoundedImage(back, 0, Number(bstart), 678, 56, 25)
            .printRoundedImage(avatar, 70, Number(start - 23), 42, 42, 25)
            .printRoundedImage(icon, 460, Number(start - 23), 42, 42, 25)
            .printRoundedImage(icon2, 560, Number(start - 23), 42, 42, 25)
            if(i == 0) {
                image.setColor("Cyan")
                image.printRoundedImage(one, 17, Number(start - 18), 32, 32, 25)
            } else if(i == 1) {
                image.setColor("Yellow")
                image.printRoundedImage(two, 17, Number(start - 18), 32, 32, 25)
            } else if(i == 2) {
                image.setColor("Green")
                image.printRoundedImage(three, 17, Number(start - 18), 32, 32, 25)
            } else if(i == 3) {
                image.setColor("Orange")
            } else if(i == 4) {
                image.setColor("Gray")
            } else {
                image.setColor("White")
            }
            if(uye.user.username.toString().length > 12) {
                image.setTextFont('18px Arial Black'), image.printText(`${uye.user.username}`, 130, Number(start + 5), 850)
            } else {
                image.setTextFont('20px Arial Black'), image.printText(`${uye.user.username}`, 130, Number(start + 2), 850)
            }
            
            if(i != 0 && i != 1 && i != 2) image.setTextFont('20px Arial Black').printText(`#${i + 1}`, 20, Number(start + 2), 850)
            image.setTextFont('18px Arial Black').printText(`${data[i].ses} Sv.`, 510, Number(start + 5), 850)
            image.setTextFont('18px Arial Black').printText(`${data[i].mesaj} Sv.`, 610, Number(start + 5), 850)
            bstart += 57
            start += 57
        }

        let attachment = new AttachmentBuilder(image.toBuffer(), { name: "cartel-siralama.png"});
    

        let ses = new genEmbed()
        .setDescription(`Aşağıda gösterilen tabloda \`${message.guild.name}\` sunucusuna ait en iyi genel ses ve mesaj seviye sıralaması gösterilmektedir. Bu sıralama ses ve mesaj xp'inizin toplamını baz alır.`)
        .setThumbnail(message.guild.iconURL({extension: 'png'}))
        .setImage("attachment://cartel-siralama.png")

        await msg.edit({
            content: null,
            components: [Row],
            embeds: [ses],
            files: [
                attachment
            ]
         })

         var filter = (i) => i.user.id == message.member.id
         let collector = await msg.createMessageComponentCollector({filter: filter, time: 60000});

         collector.on('collect', async (i) => {
            if(i.customId == "mesaj") {
                msg.delete().catch(err => {})
                let com = client.commands.find(x => x.Isim == "top")
                if(com) com.onRequest(client, message, args)
                await i.deferUpdate().catch(err => {})
            }
         })

         collector.on('end', async (c, reason) => {
                if(reason == "time") {
                    await msg.delete().catch(err => {})
                }
         })
  }
};

function çevirSüre(date) {
    return moment.duration(date).format('H [saat,] m [dakika]');
}