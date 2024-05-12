const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users')
const Discord = require("discord.js")
module.exports = {
    Isim: "tagsızat",
    Komut: ["tagsızkayıtsız"],
    Kullanim: "tagsızat",
    Aciklama: "Sunucudaki üyeler içerisinde tagı olmayanları kayıtsıza at.",
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
    const embed = new genEmbed() 
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!ayarlar.taglıalım) return message.channel.send(`${cevaplar.prefix} \`Taglı-Alım\` modu kapalı olduğundan dolayı işlem iptal edildi.`);
    let tagsızlar = message.guild.members.cache.filter(x => !x.user.username.includes(ayarlar.tag) && !x.roles.cache.has(roller.vipRolü)  && !x.roles.cache.has(roller.boosterRolü) 
    && (roller.kadınRolleri.some(r => x.roles.cache.has(r) || roller.erkekRolleri.some(r => x.roles.cache.has(r)))))
    tagsızlar.forEach(async (uye) => {
            uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`).catch(err => {})
            uye.roles.set(roller.kayıtsızRolleri).catch(err => {})
            if(uye.voice.channel) uye.voice.disconnect()
            let data = await Kullanici.findOne({_id: uye.id});
            if(data && data.Name) await Kullanici.updateOne({_id: uye.id}, {$set: { "Gender": "Kayıtsız" }, $push: { "Names": { Staff: message.member.id, Date: Date.now(), Name: data.Name, State: "Tagsız Kayıtsıza Atıldı" } } }, { upsert: true })
            uye.Delete()
            uye.removeStaff()
    })
    message.channel.send({embeds: [embed.setDescription(`Sunucuda kayıtlı olup tagı olmayan \`${tagsızlar.size}\` üye başarıyla kayıtsız'a atıldı!`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)

 }
};