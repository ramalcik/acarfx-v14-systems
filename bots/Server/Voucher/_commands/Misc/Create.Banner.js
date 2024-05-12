const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "banner-oluştur",
    Komut: ["arkaplan-oluştur","banneroluştur", "arkap-oluştur", "bannercreate", "create-banner", "banner-create" ],
    Kullanim: "banner-oluştur <Yazı>",
    Aciklama: "Belirtilen yazıda bir banner oluşturur.",
    Kategori: "diğer",
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
    let yazi = args.slice(0).join(' ');
    if(!yazi) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
     const bannerurl = `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=uprise-logo&text=${yazi}`
  .replace(' ', '+')
    embed.setDescription(`[Oluşturulan Arkaplan İçin TIKLA](${bannerurl})`)
	    .setImage(bannerurl)
    message.channel.send({embeds: [embed]});
    }
};