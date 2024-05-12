const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "rolsuzver",
    Komut: ["rolsüzver"],
    Kullanim: "rolsüzver",
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
    let embed = new genEmbed()
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let rolsuzuye =  message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guildId).size == 0);
    rolsuzuye.forEach(roluolmayanlar => { 
        roluolmayanlar.setRoles(roller.kayıtsızRolleri).catch(err => {})
    });
    message.channel.send({embeds: [embed.setDescription(`Sunucuda rolü olmayan \`${rolsuzuye.size}\` üyeye kayıtsız rolü verilmeye başlandı!`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })

    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};