const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const Afks = require('../../../../Global/Databases/Schemas/Others/Users.Afks');
const Discord = require("discord.js")
module.exports = {
    Isim: "afk",
    Komut: ["afk"],
    Kullanim: "afk <Sebep>",
    Aciklama: "Klavyeden uzak iseniz gitmeden önce bu komutu girdiğinizde sizi etiketleyenlere sizin klavye başında olmadığınızı açıklar.",
    Kategori: "diğer",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("messageCreate", async (message) => {
      if(!message.guild || message.author.bot || !message.channel || message.channel.type != 0) return;
      let GetAfk = await Afks.findById(message.member.id);
      if(message.mentions.users.size >= 1){
        let victim = message.mentions.users.first();
        let victimData = await Afks.findById(victim.id);
        if(victimData) {
          let tarih = `<t:${String(Date.parse(victimData.sure)).slice(0, 10)}:R>`;
	  if(GetAfk) {
      		await Afks.findByIdAndDelete(message.member.id)
		message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
	  }
          return message.reply({embeds: [
            new EmbedBuilder().setColor("Random").setAuthor({name: victim.username, iconURL: victim.displayAvatarURL({ extension: "png"})}).setDescription(`${victim} kullanıcısı \`${victimData.sebep ? `${victimData.sebep}\` sebebiyle ` : ""} ${tarih} AFK moduna geçti!`)
          ]}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
        })
        };
      };
      if(!GetAfk) return;
      await Afks.findByIdAndDelete(message.member.id)
      message.reply(`Merhaba **${message.author.username}** Tekrardan Hoş Geldin.`).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })
    });
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    let GetAfk = await Afks.findById(message.member.id);
    if(GetAfk) return message.reply(`${message.guild.emojiGöster(emojiler.Iptal)} AFK durumdayken tekrardan AFK olamazsın ${message.member}!`).then(x => {
        setTimeout(() => {
            x.delete()
        }, 5000);
    })
    let sebep = args.join(' ') || `Şuan da işim var yakın zaman da döneceğim!`;
    await Afks.updateOne({_id: message.member.id}, { $set: { "sure": new Date(), "sebep": sebep } }, {upsert: true})
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)

    }
};