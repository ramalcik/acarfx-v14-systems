const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "cezalartemizle",
    Komut: ["cezalartemizle","siciltemizle","sicil-temizle"],
    Kullanim: "cezalartemizle <@cartel/ID>",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "kurucu",
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
    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezalar = await Punitives.findOne({Member: uye.id});
    if(!cezalar) return message.reply({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin cezası bulunamadı.`)]});
    if(await Punitives.findOne({Member: uye.id, Active: true})) return message.reply({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin aktif cezası bulunduğundan dolayı işlem iptal edildi.`)]});

    await message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesinin tüm cezaları başarıyla temizlendi.`)]})
    await Punitives.updateMany({Member: uye.id}, { $set: { Member: `Silindi (${uye.id})`, No: "-99999", Remover: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};