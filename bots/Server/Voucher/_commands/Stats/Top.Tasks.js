const { Client, Message, EmbedBuilder} = require("discord.js");
const Invite = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "topgörev",
    Komut: ["toptasks","top-görev","top-tasks","topgorev"],
    Kullanim: "topgörev",
    Aciklama: "Sunucu içerisindeki tüm davet sıralaması görüntülenir",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait görev puanı sıralaması yükleniyor. Lütfen bekleyin!`})
    let embed = new genEmbed()
    let data = await Invite.find()
      
     
      let topTagli = data.filter(x => x.Görev).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Görev
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Görev
        return uye2Toplam2-uye1Toplam2;
    }).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.Görev
          if(m._id == message.author.id && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: **\`${uyeToplam2} Görev Puanı\`** **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: **\`${uyeToplam2} Görev Puanı\`** ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');

    load.edit({content: null, embeds: [embed.setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi görev yapanların sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `${cevaplar.prefix} ${message.guild.name} Sunucusunda da görev sıralama bilgileri bulunamadı.`}`)]}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 20000);
      })


    }
};