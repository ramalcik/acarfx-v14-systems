const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs')

const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');

const Discord = require("discord.js")
module.exports = {
    Isim: "ysenk",
    Komut: ["yetkisenkronize","y"],
    Kullanim: "y u <@cartel/ID> <Yetki S.Kodu>",
    Aciklama: "Belirlenen üyeyi terfi sistemine senkronize eder.",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika,] s [saniye]'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    if(!ayarlar.staff.includes(message.member.id)) return;
    let işlem = args[0]
    if(işlem !== "u" && işlem !== "r") return;
    if(işlem === "u") {
    let kullArray = message.content.split(" ");
    let kullArgs = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullArgs[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullArgs.slice(1).join(" ") || x.user.username === kullArgs[1])
    if(!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    if(!uye.user.username.includes(ayarlar.tag)) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let yetkiKodu = parseInt(args[2]);
    if(isNaN(yetkiKodu)) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    if(yetkiKodu > _statSystem.staffs.length) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": yetkiKodu, "staffExNo": yetkiKodu - 1, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
    let yeniYetki = _statSystem.staffs.filter(x => x.No == yetkiKodu - 1);
    if(yeniYetki) yeniYetki = yeniYetki[yeniYetki.length-1];
    if(yeniYetki) {
        if(!uye.roles.cache.has(yeniYetki.rol)) uye.roles.add(yeniYetki.rol)
        if(!uye.roles.cache.has(roller.altilkyetki)) await uye.roles.add(roller.altilkyetki);
    }
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    message.guild.kanalBul("terfi-log").send({embeds: [embed.setDescription(`${message.member} isimli yetkili ${uye} isimli üyeyi <t:${String(Date.now()).slice(0, 10)}:R> ${yeniYetki.rol ? message.guild.roles.cache.get(yeniYetki.rol) : "Bulunamadı!"} role senkronize etti.`)]})
    } else if(işlem === "r") {
      const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if(!rol) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      if(rol.members.size === 0) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        rol.members.forEach(async uye => {
          if (uye.user.bot) return;
            if (_statSystem.staffs.some(x => uye.roles.cache.has(x.rol))) {
              let cartel = _statSystem.staffs.find(x => uye.roles.cache.has(x.rol))
	      let No = Number(cartel.No)
          if(!uye.roles.cache.has(roller.altilkyetki)) await uye.roles.add(roller.altilkyetki);
              await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": No + Number(1), "staffExNo": No, "Points": 0, "ToplamPuan": 0, "Baslama": Date.now() } }, {upsert: true}); 
              //message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} kişisi \`${rol.name}\` yetkisine senkronize edildi.`);
            } else return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        
        });
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        //message.guild.kanalBul("senk-log").send(embed.setDescription(`${message.member} isimli yetkili ${rol} isimli roldeki üyeleri senkronize etti.`));
    }
  }
};


