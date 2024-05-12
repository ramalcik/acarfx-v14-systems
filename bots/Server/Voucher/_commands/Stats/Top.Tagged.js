const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Discord = require("discord.js")
module.exports = {
    Isim: "toptaglı",
    Komut: ["toptaglılar"],
    Kullanim: "toptaglı",
    Aciklama: "",
    Kategori: "stat",
    Extend: ayarlar.type,
    
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
   // if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
   let load = await message.reply({content: `${message.guild.name} sunucusuna ait taglı çekme sıralaması yükleniyor. Lütfen bekleyin!`})
   let findedIndex = ''
   let data = await Users.find()
      
      let topTagli = data.filter(x => x.Taggeds).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Taggeds.length
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Taggeds.length
        return uye2Toplam2-uye1Toplam2;
    }).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.Taggeds.length
        if(m._id == message.author.id && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: \` ${uyeToplam2} Taglı \` **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: \` ${uyeToplam2} Taglı \` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');
  
      load.edit({content: null, embeds: [embed.setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi taglı çekenlerin sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `\`${message.guild.name}\` sunucusun da taglı bilgileri bulunamadı.`}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
 
  }
};