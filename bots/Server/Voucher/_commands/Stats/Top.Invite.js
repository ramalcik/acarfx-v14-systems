const { Client, Message, EmbedBuilder} = require("discord.js");
const Invite = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "topdavet",
    Komut: ["topinvite"],
    Kullanim: "topinvite",
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
    let load = await message.reply({content: `${message.guild.name} sunucusuna ait davet sıralaması yükleniyor. Lütfen bekleyin!`})
    let embed = new genEmbed()
    let findedIndex = '';
    let data = await Invite.find()
    
      let topTagli = data.filter(x => x.total).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.total
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.total
        return uye2Toplam2-uye1Toplam2;
    }).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.total
        if((index + 1) > 20) findedIndex =  `\`${index + 1}.\` <@${m.userID}> toplam **${m.total}** üye davet etmiş. ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        return `\`${index + 1}.\` <@${m.userID}> toplam **${m.total}** üye davet etmiş. ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
    }).slice(0, 20).join('\n');

    load.edit({content: null, embeds: [embed.setDescription(`Aşağı da **${message.guild.name}** sunucusunun en iyi davet yapanların sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `${cevaplar.prefix} ${message.guild.name} Sunucusun da davet bilgileri bulunamadı.`}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })


    }
};

