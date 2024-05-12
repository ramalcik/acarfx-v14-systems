const { Client, Message, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "sunucu",
    Komut: ["guild"],
    Kullanim: "sunucu",
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
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let process = ["isim","afiş","resim"]
    if(!process.some(x => args[0] == x)) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <${process.map(x => x).join("/")}> <Yeni İçerik>\``);
    
    if(args[0] == "isim") {
      if(!args[1]) return message.channel.send(`${cevaplar.prefix} Lütfen bir sunucu ismi belirleyin.`).then(x => setTimeout(() => { x.delete() }, 7500));
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      return setName(message.guild, message.member, message.channel, args.slice(1).join(" "), message.guild.name, embed);
    }
    if(args[0] == "afiş") {
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      return setBanner(message.guild, message.member, message.channel, args.slice(1).join(" ") || message.attachments.first().url, message.guild.bannerURL({extension: 'png'}), embed);
    }
    if(args[0] == "resim") {
      message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
      return setIcon(message.guild, message.member, message.channel, args.slice(1).join(" ") || message.attachments.first().url, message.guild.iconURL({extension: 'png'}), embed);
    }
    
  }
};


async function setIcon(guild, member, channel, newIcon, oldIcon, embed) {
  embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu resmini değiştirdi.`).setThumbnail(oldIcon).setImage(newIcon)
  await guild.setBanner(newIcon).catch(err => {})
  
  guild.kanalBul("guild-log").send({embeds: [embed]})
  
  ayarlar.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff);
    if(botOwner) botOwner.send({embeds: [embed]}).catch(x => {})
  });

  let taç = member.guild.members.cache.get(member.guild.ownerId)
  if(taç) taç.send({embeds: [embed]}).catch(err => {})

  await channel.send({embeds: [embed]}).then(x => {
   setTimeout(() => {x.delete()}, 7500)
  })
}


async function setBanner(guild, member, channel, newBanner, oldBanner, embed) {
  embed.setDescription(`${member} (\`${member.id}\`)  isimli yönetici sunucu afişini değiştirdi.`).setThumbnail(oldBanner).setImage(newBanner)
  await guild.setBanner(newBanner).catch(err => {})

  guild.kanalBul("guild-log").send({embeds: [embed]})
  
  ayarlar.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff);
    if(botOwner) botOwner.send({embeds: [embed]}).catch(x => {})
  });

  let taç = member.guild.members.cache.get(member.guild.ownerId)
  if(taç) taç.send({embeds: [embed]}).catch(err => {})

  await channel.send({embeds: [embed]}).then(x => {
   setTimeout(() => {x.delete()}, 7500)
  })
}


async function setName(guild, member, channel, newName, oldName, embed) {
  embed.setDescription(`${member} (\`${member.id}\`) isimli yönetici sunucu ismini \`${oldName}\` => \`${newName}\` olarak değiştirdi.`)
  await guild.setName(newName).catch(err => {})
  guild.kanalBul("guild-log").send({embeds: [embed]})
  
  ayarlar.staff.forEach(staff => {
    let botOwner = guild.members.cache.get(staff);
    if(botOwner) botOwner.send({embeds: [embed]}).catch(x => {})
  });

  let taç = member.guild.members.cache.get(member.guild.ownerId)
  if(taç) taç.send({embeds: [embed]}).catch(err => {})

  await channel.send({embeds: [embed]}).then(x => {
   setTimeout(() => {x.delete()}, 7500)
  })
}
