const { Client, Message, EmbedBuilder} = require("discord.js");
const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "teyit",
    Komut: ["Teyit", "kayıtbilgi","kayıt-bilgi"],
    Kullanim: "teyit <@cartel/ID>",
    Aciklama: "Belirtilen üye ve komutu kullanan üyenin teyit bilgilerini gösterir.",
    Kategori: "teyit",
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
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!uye) return message.reply(cevaplar.üyeyok).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    uye = message.guild.members.cache.get(uye.id)
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let teyit = await Kullanici.findOne({ _id: uye.id }) || [];
    let teyitBilgisi;
    if(teyit.Records){
      let erkekTeyit = teyit.Records.filter(v => v.Gender === "Erkek").length
      let kizTeyit = teyit.Records.filter(v => v.Gender === "Kadın").length
      let bazıları = teyit.Records.filter(v => message.guild.members.cache.get(v.User)).map((value, index) => message.guild.members.cache.get(value.User))
      let çıkanlar = teyit.Records.filter(v => !message.guild.members.cache.get(v.User)).length
      let taglılar = teyit.Records.filter(x => {
        let uye = message.guild.members.cache.get(x.User)
        return uye && uye.user.username.includes(ayarlar.tag)
      }).length

      teyitBilgisi = `${uye} toplam **${erkekTeyit+kizTeyit}** kişi kayıt etmiş! (**${erkekTeyit}** erkek, **${kizTeyit}** kadın, ${ayarlar.type ? `**${taglılar}** taglı, ` : ``}**${çıkanlar}** çıkanlar)
${erkekTeyit+kizTeyit > 0 ? `Kayıt edilen bazı kişiler: ${bazıları ? bazıları.length > 10  ? `${bazıları.slice(0, 10).join(", ")} ve ${erkekTeyit + kizTeyit - 10} daha fazla ` : bazıları.slice(0, 10).join(",") : bazıları }`  : ''}`;
    } else { 
      teyitBilgisi = `${uye} isimli üyenin teyit bilgisi bulunamadı.`
    }
    message.reply({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(teyitBilgisi)]});
    }
};