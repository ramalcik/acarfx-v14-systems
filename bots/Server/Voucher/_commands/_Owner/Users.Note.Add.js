const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

const Discord = require("discord.js")
module.exports = {
    Isim: "not",
    Komut: ["notoluştur"],
    Kullanim: "not <@cartel/ID> <Not>",
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
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Bir üye belirtmediğinden işlem iptal edildi.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    const not = args.slice(1).join(" ");
    if(!not) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Bir not girmediğinden dolayı işlem iptal edildi.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    await Users.updateOne({_id: uye.id}, {$push: { "Notes": { "Author": message.member.id, "Note": not, "Date": Date.now() }}}, {upsert: true})
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} isimli üyeye \`${not}\` notu <t:${String(Date.now()).slice(0, 10)}:R> eklendi.`)]}).then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};

