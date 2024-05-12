const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "avatar",
    Komut: ["av", "pp"],
    Kullanim: "avatar <@cartel/ID>",
    Aciklama: "Belirtilen üyenin profil resmini büyültür.",
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
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let avatar = victim.avatarURL({ extension: 'png', size: 2048 });
    let urlButton = new ButtonBuilder()
    .setURL(`${avatar}`)
    .setLabel(`Resim Adresi`)
    .setStyle('LINK')    
    let urlOptions = new ActionRowBuilder().addComponents(
        urlButton
    );
    embed
        .setAuthor({ name: victim.username, iconURL: avatar})
        .setImage(avatar)
    let uye = message.guild.members.cache.get(victim.id)
    if(uye) uye._views()
    message.reply({embeds: [embed], components: [urlOptions]});
    }
};