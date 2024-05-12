const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const moment = require('moment')
const Discord = require("discord.js")
module.exports = {
    Isim: "topstreaming",
    Komut: ["topyayın","topstream","topyayın","yayınsıralaması","topstreamer"],
    Kullanim: "topstreaming",
    Aciklama: "",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait yayın açma sıralaması yükleniyor. Lütfen bekleyin!`})
    let embed = new genEmbed()
    let findedIndex = ''
    let data = await Users.find()
     
      let topTagli = data.filter(x => x.Streaming).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2.Streaming.map(x => {
            uye2Toplam2 += Number(x.End - x.Start)
        })
        let uye1Toplam2 = 0;
        uye1.Streaming.map(x => {
            uye1Toplam2 += Number(x.End - x.Start)
        })
        return uye2Toplam2-uye1Toplam2;
    }).map((m, index) => {
        let uyeToplam2 = 0;
         m.Streaming.map(x => {
            uyeToplam2 += Number(x.End - x.Start)
        })
        if(message.author.id == m._id && uyeToplam2 != 0 && (index + 1) > 20) findedIndex = `\`${index+1}.\` <@${m._id}>: \`${moment.duration(uyeToplam2).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika] s [saniye]')}\` **(Siz)**`
        return `\`${index + 1}.\` <@${m._id}>: \`${moment.duration(uyeToplam2).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika] s [saniye]')}\` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');



    load.edit({content: null, embeds: [embed.setDescription(`Aşağı da **${message.guild.name}** sunucusunda en iyi yayın süresine sahip olan 20 üye aşağıda sıralandırılmaktadır.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `${cevaplar.prefix} ${message.guild.name} Sunucusun da yayın süresi bulunan bir veya birden fazla üye bulunamadı.`}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
  
  }
};