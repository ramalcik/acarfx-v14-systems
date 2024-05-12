const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "ünlemkaldır",
    Komut: ["unlemkaldır", "isim-ünlemtemizle", "unlemkaldir", "ümlemlerikaldır"],
    Kullanim: "ünlemkaldır",
    Aciklama: "",
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
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let ünlemliler = message.guild.members.cache.filter(x => x.displayName.includes("!"))
    ünlemliler.forEach(async (uye) => {
       await uye.setNickname(uye.displayName.replace("!","")).catch(err => {})
       if(uye.displayName.includes(".")) await uye.setNickname(uye.displayName.replace(".","")).catch(err => {})
    })
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${ünlemliler.size}\` üyenin isminde ki __ünlem, özel karakter veya boşluk__ kaldırıldı.`)]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 17500);
    })
} 
};

