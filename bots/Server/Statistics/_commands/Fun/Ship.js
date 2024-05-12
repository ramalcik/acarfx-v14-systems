const { Client, Message, EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require('canvas')
Canvas.registerFont(`../../Assets/fonts/theboldfont.ttf`, { family: "Bold" });
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
let cooldown = new Map()
const Discord = require("discord.js")
module.exports = {
    Isim: "ship",
    Komut: ["shippe","love","sanal8"],
    Kullanim: "ship @keasy/ID",
    Aciklama: "Bir üyenin coin bilgisini görüntüler.",
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
        if(!message.channel.name.includes("ship")) return message.reply(`${cevaplar.prefix} Sadece ${message.guild.channels.cache.filter(x => x.name.includes("ship")).map(x => x).join(", ")} kanallarında kullanabilirsiniz.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {x.delete()}, 5000)
            })
        if(cooldown.get(message.member.id)) return message.reply({content: `Bu komutu **5** saniyede bir kullanabilirsiniz. ${cevaplar.prefix}`}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500));
        let person = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!person || message.author.id === person.id) {
            person = message.guild.members.cache
           .filter(m => m.id !== message.author.id && !roller.kayıtsızRolleri.some(x => m.roles.cache.get(x))) 
           .random();
           if(roller.erkekRolleri.some(x => message.member.roles.cache.has(x))) person = message.guild.members.cache
           .filter(m => m.id !== message.author.id && !roller.kayıtsızRolleri.some(x => m.roles.cache.get(x)) && roller.kadınRolleri.some(x => m.roles.cache.get(x))) 
           .random();
           if(roller.kadınRolleri.some(x => message.member.roles.cache.has(x))) person = message.guild.members.cache
           .filter(m => m.id !== message.author.id && !roller.kayıtsızRolleri.some(x => m.roles.cache.get(x)) && roller.erkekRolleri.some(x => m.roles.cache.get(x))) 
           .random();
           
        }

        person = message.guild.members.cache.get(person.id)
        let özel = [
            "817463869487185980"
        ]
        person._views()
        if(özel.includes(person.id)) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Tabi Efendim Ship Atarsın.`}).then(x => {
            message.delete().catch(err => {})
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 5000)
        });
        
        let replies = [
            '5% Uyumlu!',     '3% Uyumlu!',
            '10% Uyumlu!',    '14% Uyumlu!',
            '17% Uyumlu!',    '20% Uyumlu!',
            '22% Uyumlu!',    '25% Uyumlu!',
            '24% Uyumlu!',    '27% Uyumlu!',
            '32% Uyumlu!',    '36% Uyumlu!',
            '34% Uyumlu!',    '39% Uyumlu!',
            '42% Uyumlu!',    '45% Uyumlu!',
            '47% Uyumlu!',    '51% Uyumlu!',
            '54% Uyumlu!',    '56% Uyumlu!',
            '59% Uyumlu!',    '58% Uyumlu!',
            '60% Uyumlu!', '63% Uyumlu!',
            '65% Uyumlu!', '64% Uyumlu!',
            '68% Uyumlu!',  '70% Uyumlu!',
            '74% Uyumlu!',  '78% Uyumlu!',
            '79% Uyumlu!',  '80% Uyumlu!',
            '83% Uyumlu!',  '86% Uyumlu!',
            '84% Uyumlu!',  '89% Uyumlu!',
            '91% Uyumlu!',  '93% Uyumlu!',
            '95% Uyumlu!',  '97% Uyumlu!',
            '98% Uyumlu!',  '99% Uyumlu!',
            '100% Uyumlu!', 'Evlenmeye mahkumsunuz.'
        ]
        
        let emoti = Math.floor((Math.random()*replies.length))
        let love = replies[emoti]
        let emoticon;
        if(emoti <= 44 && emoti >= 23) {
           emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_2.png?v=1593651528429'); 
        } else if(emoti < 23 && emoti >= 12) {
            emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_3-1.png?v=1593652255529'); 
        } else if(emoti < 11) {
            emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_1.png?v=1593651511900'); 
        }
        const canvas = Canvas.createCanvas(384, 128);
        const ctx = canvas.getContext('2d');
        const emotes = await Canvas.loadImage(emoticon);
        const avatar1 = await Canvas.loadImage(message.member.displayAvatarURL({ format: "png" }));
        const avatar2 = await Canvas.loadImage(person.displayAvatarURL({ format: "png" }));
        ctx.beginPath();
        ctx.moveTo(0 + Number(10), 0);
        ctx.lineTo(0 + 384 - Number(10), 0);
        ctx.quadraticCurveTo(0 + 384, 0, 0 + 384, 0 + Number(10));
        ctx.lineTo(0 + 384, 0 + 128 - Number(10));
        ctx.quadraticCurveTo(
        0 + 384,
        0 + 128,
        0 + 384 - Number(10),
        0 + 128
        );
        ctx.lineTo(0 + Number(10), 0 + 128);
        ctx.quadraticCurveTo(0, 0 + 128, 0, 0 + 128 - Number(10));
        ctx.lineTo(0, 0 + Number(10));
        ctx.quadraticCurveTo(0, 0, 0 + Number(10), 0);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 384, 128);
        let background = await Canvas.loadImage(client.guilds.cache.get(sistem.SERVER.ID).bannerURL({extension: 'png'}) ? client.guilds.cache.get(sistem.SERVER.ID).bannerURL({extension: 'png'}) + `?size=4096` : "https://cdn.discordapp.com/attachments/1019290688136958028/1023941333716566046/thumb-1920-1146731.jpg");
        ctx.drawImage(background, 0, 0, 384, 129);
        ctx.beginPath();
        ctx.globalAlpha = 0.5
        ctx.fillStyle = "#000000";
        
        //ctx.fillRect(50, 30, 980, 350);
        
        ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(55, 5, 275, 115);
    ctx.globalAlpha = 1;
        
        ctx.drawImage(avatar1, 70, 12, 100, 100);
        ctx.drawImage(avatar2, 215, 12, 100, 100);
        ctx.drawImage(emotes, 150, 20, 75, 75);
        const img = new AttachmentBuilder(canvas.toBuffer(), { name: 'ship.png'})
        let Row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel("😀 Tanış!")
            .setDisabled(emoti <= 44 && emoti >= 23 ? false : true)
            .setCustomId("test")
            .setStyle(ButtonStyle.Success)
        )
        message.reply({components: [Row], content: `${person}`,content: `[ **${person.displayName}** & **${message.member.displayName}** ]
Uyumluğu musun? **${love}**`, files: [img]}).then(async (msg) => {
    var filter = (i) => i.user.id == message.member.id
    let collector = msg.createMessageComponentCollector({filter: filter, max: 1})
    collector.on('collect', async (i) => {
        if(i.customId == "test") {
            i.reply({content: `Şuanlık **Tanışma Sistemi** Devre-dışı olduğundan dolayı sadece **DM** üzerinden iletişime geçebilirsin.`, ephemeral: true})
           
        }
    })
});
        cooldown.set(message.author.id, true)
        setTimeout(() => {
            if(cooldown.get(message.member.id)) cooldown.delete(message.author.id)
        }, 5000);
        
    }
};

