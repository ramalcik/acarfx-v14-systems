const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "emojiyükle",
    Komut: ["emojioluştur", "emojiekle", "emekle", "emyükle"],
    Kullanim: "emojiyükle <Emoji/Emoji Bağlantısı> <Emoji Adı>",
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
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, msg, args) {

    if(!ayarlar.staff.includes(msg.member.id) && !msg.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.üstYönetimRolleri.some(oku => msg.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => msg.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const hasEmoteRegex = /<a?:.+:\d+>/gm
    const emoteRegex = /<:.+:(\d+)>/gm
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm
    let isim = `Rand_${Math.round((Math.random()*9999))}`
    if(args[1]) isim = `${args[1]}`
    const message = msg.content.match(hasEmoteRegex)
      if (emoji = emoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1", isim, msg)
      else 
      if (emoji = animatedEmoteRegex.exec(message)) return EmojiYükle("https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1", isim, msg)
      else {
        let [link, ad] = args.slice(0).join(" ").split(" ");
        if (!link) return msg.channel.send(`${cevaplar.prefix} Lütfen bir bağlantı belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
        if (!ad) return msg.channel.send(`${cevaplar.prefix} Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Bağlantı> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
        EmojiYükle(link, ad, msg)
      }
    }
};

function EmojiYükle(link, ad, message) {
  message.guild.emojis.create({
    name: ad,
    attachment: link
  })
  .then(emoji => message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla \`${emoji.name}\` adında emoji oluşturuldu. (${emoji})`)]}).then(x => {
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)  
    setTimeout(() => {
          x.delete()

      }, 7500);
  }))

  .catch(console.error);
}