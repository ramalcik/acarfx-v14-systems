const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "sleep",
    Komut: ["sleep","sleeptaşı","sleep-taşı"],
    Kullanim: "sleep",
    Aciklama: "",
    Kategori: "yönetim",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!ayarlar.staff.includes(message.member.id) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let voiceChannel = message.member.voice.channelId;
    if (!voiceChannel && !args[0]) return message.reply(`${cevaplar.prefix} Ses kanalında olmadığın için işlem iptal edildi.`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(uye) {
         if(!uye.voice.channel) return message.reply(`${message.guild.emojiGöster(emojiler.Iptal)} Belirtilen **${uye.user.username}** isimli üye seste aktif olmadığından işlem iptal edildi.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
       await uye.voice.setChannel(kanallar.sleepRoom)
       return message.reply(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla! ${uye} isimli üye ${message.guild.channels.cache.get(kanallar.sleepRoom)} kanalına taşındı!`).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 8500);
    });
    } else {
        let uyeler = message.member.voice.channel.members.filter(x => x.voice.selfDeaf || x.voice.selfMute)
        if(uyeler.size <= 0) return message.reply(`${message.guild.emojiGöster(emojiler.Tag)} Bulunduğun odada kulaklığı veya mikrofonu kapalı üye bulunamadı.`).then(x => {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
        
        message.member.voice.channel.members.array().filter(x => x.voice.selfDeaf || x.voice.selfMute).forEach((m, index) => {
        setTimeout(() => {
            m.voice.setChannel(kanallar.sleepRoom);
        }, index*1000);
        });
        message.reply(`${message.guild.emojiGöster(emojiler.Onay)} Bulunduğun ${message.member.voice.channel} adlı ses kanalında kulaklığı veya mikrofonu kapalı olan ${uyeler.size} üyeyi(leri) ${message.guild.channels.cache.get(kanallar.sleepRoom)} kanalına taşıdım.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 8500);
        });
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
  }
}