const { Client, Msg, MsgEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "emojidüzenle",
    Komut: ["emojiduzenle", "emojiadlandir", "emduzenle", "emdüzenle","emd"],
    Kullanim: "emojiduzenle <Emoji/Emoji Ismi> <Yeni Emoji Adı>",
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
   * @param {Msg} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, msg, args) {
    if(!ayarlar.staff.includes(msg.member.id) && !msg.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => msg.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const hasEmoteRegex = /<a?:.+:\d+>/gm
    const emoteRegex = /<:.+:(\d+)>/gm
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm
    let yeniIsmim = args[1]
    if(!yeniIsmim) return msg.channel.send(`${cevaplar.prefix} Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Emoji> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
    const message = msg.content.match(hasEmoteRegex)
    if (emoji = emoteRegex.exec(message)) return EmojiYükle(emoji[1], yeniIsmim, msg)
    else 
    if (emoji = animatedEmoteRegex.exec(message)) return EmojiYükle(emoji[1], yeniIsmim, msg)
    else {
      let [link, ad] = args.slice(0).join(" ").split(" ");
      if (!link) return msg.channel.send(`${cevaplar.prefix} Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Emoji Ismi> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
      if (!ad) return msg.channel.send(`${cevaplar.prefix} Lütfen bir emoji ismi belirtmelisin! __Örn:__ \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <Emoji Ismi> <Emoji Ismi>\``).then(x => setTimeout(() => { x.delete() }, 7500));
      EmojiYükle(link, ad, msg)
    }
}
}

function EmojiYükle(link, ad, message) {
    let emojiFind = message.guild.emojis.cache.get(link) || message.guild.emojis.cache.find(x => x.name == link)
    if(emojiFind) {
        emojiFind.setName(ad)
        message.reply(`Başarıyla ${emojiFind} emojisinin ismi **${ad}** olarak güncellendi. ${message.guild.emojiGöster(emojiler.Onay)}`).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
                message.reply(message.guild.emojiGöster(emojiler.Onay))
            }, 7500);
        })
    } else {
        message.reply(`Belirtilen isimde rol bulunamadı. ${cevaplar.prefix}`).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
                message.reply(message.guild.emojiGöster(emojiler.Iptal))
            }, 7500);
        })
    }
}