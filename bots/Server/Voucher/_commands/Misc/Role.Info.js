const {ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Seens = require('../../../../Global/Databases/Schemas/Guild.Users.Seens');
let seens = []
const Discord = require("discord.js")
module.exports = {
    Isim: "rolbilgi",
    Komut: ["rol-bilgi", "rolinfo", "bilgirol"],
    Kullanim: "rolbilgi <@Rol/ID>",
    Aciklama: "Belirtilen roldeki üyeleri sayar.",
    Kategori: "yönetim",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000)); 
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(!role) return message.reply({content: `Belirtilen argümanlarda rol'e ait herhangi bir bilgi bulunamadı.`}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {

        })
        setTimeout(() => {
                x.delete().catch(err => {

                })
        }, 5000);
    })

    message.member.Leaders("rol", 0.01, {type: "ROLE", role: role.id, channel: message.channel.id})
    let load = await message.reply({content: `Belirtilen ${role.name} rolünün bilgileri getirilirken lütfen bekleyin.`})
    let offlinemembers = role.members.filter(x => !x.presence)
    let sestemembers = role.members.filter(x => (x.presence && x.presence !== "offline") && x.voice.channel)
    let sesteolmayanaktif = role.members.filter(x => (x.presence && x.presence !== "offline") && !x.voice.channel)
    let offlineamaseste = role.members.filter(x => !x.presence && x.voice.channel)
    let text = `**Rol Adı**: ${role.name} (\`${role.id}\`)
**Rol Rengi**: ${role.hexColor} (\`${role.color}\`)
**Rol Pozisyon**: ${role.rawPosition}
**Rol Üye Sayısı**:  ${role.members.size} 
─────────────────────
**Üyeler (\`Çevrim-Dışı\`) (\`${offlinemembers.size} üye\`)**
─────────────────────
${offlinemembers.size > 0 ? offlinemembers.map(x => {
    return `<@${x.id}> [\`${x.displayName ? x.displayName : x.username}\`]`
}).join("\n") : `Çevrim-dışı üye bulunamadı.`}
─────────────────────
**Üyeler (\`Aktif - Seste Olmayan\`) (\`${sesteolmayanaktif.size} üye\`)**
─────────────────────
${sesteolmayanaktif.size > 0 ? sesteolmayanaktif.map(x => {
    return `${x} [\`${x.displayName ? x.displayName : x.username}\`] (\`${x.id}\`)`
}).join("\n") : `Seste olmayan aktif bir üye bulunamadı.`}
─────────────────────
**Üyeler (\`Seste Olanlar\`) (\`${sestemembers.size} üye\`)**
─────────────────────
${sestemembers.size > 0 ? sestemembers.map(x => {
return `${x} [\`${x.displayName ? x.displayName : x.username}\`] (${x.voice.channel})`
}).join("\n") : `Seste olan üye bulunamadı.`}
─────────────────────
**Üyeler (\`Çevrim-Dışı - Seste Olanlar\`) (\`${offlineamaseste.size} üye\`)**
─────────────────────
${offlineamaseste.size > 0 ? offlineamaseste.map(x => {
return `${x} [\`${x.displayName ? x.displayName : x.username}\`] (${x.voice.channel})`
}).join("\n") : `Çevrim-dışı ama seste bulunan üye bulunamadı.`}
─────────────────────`

    load.edit({content: `${text}`}).catch(err => {
        const arr = splitMessages(`${text}`, { maxLength: 1950, char: "" });
        load.edit({content: `Belirtilen ${role.name} rolünde 2048 karakteri aşan listeleme bulunduğundan aşağıya yeni mesaj şeklinde listeleyecektir.`})
        arr.forEach(element => {
           message.channel.send({content: `${element}`});
        });
})

function splitMessages(text, options = {}) {
    const maxLength = options.maxLength || 2000;
    const char = options.char || "\n";
    const messages = [];
    
    const lines = text.split(char);
    let currentMessage = "";
    let currentLength = 0;
    
    for (const line of lines) {
      if (currentLength + line.length + char.length <= maxLength) {
        currentMessage += line + char;
        currentLength += line.length + char.length;
      } else {
        messages.push(currentMessage);
        currentMessage = line + char;
        currentLength = line.length + char.length;
      }
    }
    
    if (currentMessage.length > 0) {
      messages.push(currentMessage);
    }
    
    return messages;
  }

  }

};
