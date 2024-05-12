const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Coins = require('../../../../Global/Databases/Schemas/Client.Users');

const Discord = require("discord.js")
module.exports = {
    Isim: "zenginler",
    Komut: ["topcoin","top-coin","zenginlistesi"],
    Kullanim: "topcoin",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    Kategori: "eco",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    let Zenginler = []
    let data = await Coins.find()
    data.map(x => {
        Zenginler.push({
          _id: x._id,
          Gold: x.Gold,
          Coin: x.Coin
        })
    })
    message.reply({embeds: [embed.setDescription(`Aşağıda ki sıralama altın ve para bazından **30** üye aşağıda listelenmektedir.

${Zenginler.sort((a,b) => {
      return Number((b.Gold * client.dovizAltın) + b.Coin) - Number((a.Gold * client.dovizAltın) + a.Coin)
    }).filter(x => message.guild.members.cache.get(x._id) && !ayarlar.staff.includes(x._id) && !message.guild.members.cache.get(x._id).user.bot).slice(0, 30).map((x, index) => `\` ${index+1} \` ${x._id ? message.guild.members.cache.get(x._id) : `<@${x._id}>`} \` ${x.Coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} \` ${message.guild.emojiGöster(emojiler.Görev.Para)} | \` ${x.Gold} \` ${message.guild.emojiGöster(emojiler.Görev.Altın)} ${x._id == message.member.id ? `**(Siz)**` : ``}`).join("\n")}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
   }
};