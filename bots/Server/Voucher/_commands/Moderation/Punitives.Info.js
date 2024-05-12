const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {genEmbed} = require('../../../../Global/Init/Embed')
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const ms = require('ms');

const Discord = require("discord.js")
module.exports = {
    Isim: "ceza",
    Komut: ["cezabilgi"],
    Kullanim: "ceza <#Ceza-No>",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
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
   
    if(!Number(args[0])) return message.reply(`${cevaplar.prefix} Ceza numarası yerine başka birşey girmiş olmalısın! **Lütfen Doğru Ceza Numarası Giriniz.**`).then(x => setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500))
    let res = await Punitives.findOne({ No: args[0]})
    if(!res) return message.reply(`${cevaplar.prefix} **Hatalı!** Lütfen Doğru Ceza Numarası Giriniz.`).then(x => setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500))
        // Cezalanan Üye
        let cezalanan = await client.getUser(res.Member);
        let cezalananbilgi;
        if(cezalanan != `\`Bulunamayan Üye\`` && cezalanan.username) cezalananbilgi = `${cezalanan} (\`${cezalanan.id}\`)`;
        if(!cezalananbilgi) cezalananbilgi = "<@"+res.Member+">" + `(\`${res.Member}\`)`
        // Ceza Veren Üye
        let yetkili = await client.getUser(res.Staff);
        let yetkilibilgi;
        if(yetkili != `\`Bulunamayan Üye\`` && yetkili.username) yetkilibilgi = `${yetkili} (\`${yetkili.id}\`)`;
        if(!yetkilibilgi) yetkilibilgi = "Bilinmiyor"
        // Manuel Komut İle Kaldırıldıysa
        let kaldırılmadurumu;
        if(!res.Remover) kaldırılmadurumu = `` 
        if(res.Remover) kaldırılmadurumu = "• Ceza'yı Kaldıran: " + `${await client.getUser(res.Remover) ? message.guild.members.cache.get(res.Remover) ? message.guild.members.cache.get(res.Remover) : `<@${res.Remover}> (\`${res.Remover}\`)` : `<@${res.Remover}> (\`${res.Remover}\`)` }`
        message.channel.send({embeds: [new genEmbed().setDescription(`**Ceza Detayı** (\`#${res.No}/${res.Type}\`)
• Üye Bilgisi: ${cezalanan}
• Yetkili Bilgisi: ${yetkili}
• Ceza Tarihi: \`${tarihsel(res.Date)}\`
• Ceza Süresi: \`${res.Duration ? moment.duration(res.Duration - res.Date).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika] ') : "Kalıcı"}\`
• Ceza Durumu: \`${res.Active == true ? "Aktif ✅" : "Aktif Değil ❌"}\`
${kaldırılmadurumu}`).addFields({ name: `Ceza Sebebi`, value: `\`${res.Reason}\``})]})
    }
};