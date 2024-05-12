const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');

const Discord = require("discord.js")
module.exports = {
    Isim: "uyarı",
    Komut: ["warn"],
    Kullanim: "warn <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi ceza şeklinde uyarır ve cezalarına işler.",
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
        if(!roller.warnHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if(!uye && message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let sebep = args.splice(1).join(" ");
        if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        let lastWarn = await Punitives.find({Member: uye.id, Type: "Uyarılma"})
        let checkRoles = [...roller.Yetkiler, ...roller.jailHammer, ...roller.üstYönetimRolleri, ...roller.yönetimRolleri,...roller.altYönetimRolleri, ...roller.kurucuRolleri]
        if(!checkRoles.some(x => uye.roles.cache.has(x)) && !uye.permissions.has(Discord.PermissionFlagsBits.Administrator) && lastWarn.length >= 3) {
            if(roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) {
                if(Number(ayarlar.jailLimit) && client.fetchJailLimit.get(message.member.id) >= ayarlar.jailLimit) return await uye.addPunitives(6, message.member, sebep, message),message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                uye.dangerRegistrant() 
                return uye.addPunitives(3, message.member, "Gereğinden fazla uyarı cezası bulunmak!" + ` (${sebep})`, message) 
            }
        }
        await uye.addPunitives(6, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)

    }
};


