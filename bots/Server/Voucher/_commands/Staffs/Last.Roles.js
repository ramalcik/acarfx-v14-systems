const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "sonyetki",
    Komut: ["son-yetkisi","sonrolleri","sonroller","yetkibırakan"],
    Kullanim: "yetkibırakan <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
    Kategori: "yönetim",
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
        if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let data = await Unleash.findOne({_id: uye.id})
        if(!data) return message.reply(cevaplar.data).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        message.channel.send({embeds: [new genEmbed().setTimestamp().setDescription(`:tada: ${uye} isimli eski yetkili üyenin eski rolleri aşağıda belirtilmiştir.\n
\` ••❯ \` **Rolleri Şunlardır**:\n${data ? data.unleashRoles.map(x => `\` • \` ${message.guild.roles.cache.get(x)} (\`${x}\`)`).join("\n") : `${message.guild.emojiGöster(emojiler.Onay)} Veritabanına bir rol veya bir veri bulunamadı!`}`)]})

    }
};