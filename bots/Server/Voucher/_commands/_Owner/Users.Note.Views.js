const { Client, Message, EmbedBuilder, Util } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

const Discord = require("discord.js")
module.exports = {
    Isim: "notlar",
    Komut: ["not-listele","notes"],
    Kullanim: "notlar <@cartel/ID>",
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
    let User = await Users.findOne({_id: uye.id})
    if(!User) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Belirtilen ${uye} isimli üyenin veritabanında hiç bir kayıdı bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    if(User && !User.Notes) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Belirtilen ${uye} isimli üyenin notları bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    if(User && User.Notes && !User.Notes.length > 0) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Belirtilen ${uye} isimli üyenin notları bulunamadı.`}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            msg.delete()
        }, 7500);
    })
    let Notlar = User.Notes.map((data, index) => `\` ${index + 1} \` **${data.Note}** (${data.Author ? message.guild.members.cache.get(data.Author) : `<@${data.Author}>`}) (\`${data.Date ? tarihsel(data.Date) : tarihsel(Date.now())}\`)`).join("\n")
    message.channel.send({embeds: [new genEmbed().setFooter({ text: `${message.member.user.username} tarafından istendi.`}).setDescription(`Aşağıda ${uye} isimli üyenin yöneticiler tarafından eklenmiş notları listelenmektedir.\n\n${Notlar}`)]}).then(async (msg) => {
    })
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};

