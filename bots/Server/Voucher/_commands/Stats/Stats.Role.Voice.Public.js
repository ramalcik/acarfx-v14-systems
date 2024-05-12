const { EmbedBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const Discord = require("discord.js")
module.exports = {
    Isim: "public",
    Komut: ["public","publicodalar"],
    Kullanim: "public <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin public, register ve genel ses denetimini sağlar.",
    Kategori: "stat",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
    if (rol.members.size === 0) return message.reply({content: `${cevaplar.prefix} Belirtilen rolde üye bulunamadığından işlem iptal edildi.`, ephemeral: true }),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    let Sesdenetim =  await Stats.find({guildID: message.guild.id});
    Sesdenetim = Sesdenetim.filter(s => message.guild.members.cache.has(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
    let veriler = []
    
    let PublicListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyeToplam += x });
        veriler.push(m.userID)
        return `\` ${index+1}. \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');
    let verisizler = rol.members.filter(x => !veriler.includes(x.id))
    let text = `Aşağı da **${rol.name}** (\`${rol.id}\`) rolüne ait haftalık **Public (Genel Ses Odaları)** kategori istatistikleri listelendirilmiştir.
──────────────────────
${PublicListele}${verisizler.size > 0 ? `
──────────────────────
**${rol.name}** rolüne ait **Public (Genel Ses Odaları)** kategorisine ait verileri bulunmayan kullanıcılar şunlardır:
${verisizler.map(x => x).join(", ")}` : ``}`
    message.reply({content: `${text}`}).catch(err => {        
        const arr = splitMessages(`${text}`, { maxLength: 1950, char: "\n" });
        arr.forEach(element => {
           message.channel.send({content: `${element}`});
        });
    })

    function splitMessages(text, options = {}) {
        const maxLength = options.maxLength || 2000;
        const char = options.char || "\n";
        const messages = [];
        
        const lines = text.split(char);
        let currentMessage = "";
        let currentLength = 0;
        
        for (const line of lines) {
          if (currentLength + line.length + char.length <= maxLength) {
            currentMessage += line + char;
            currentLength += line.length + char.length;
          } else {
            messages.push(currentMessage);
            currentMessage = line + char;
            currentLength = line.length + char.length;
          }
        }
        
        if (currentMessage.length > 0) {
          messages.push(currentMessage);
        }
        
        return messages;
      }
  }
};