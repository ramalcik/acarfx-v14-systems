const { Client, Message, EmbedBuilder, Guild, AttachmentBuilder } = require("discord.js");
const Snipe = require('../../../../Global/Databases/Schemas/Others/Channels.Snipe')
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
require("moment-timezone");
const Discord = require("discord.js")
module.exports = {
    Isim: "snipe",
    Komut: ["snipe"],
    Kullanim: "snipe",
    Aciklama: "Komutun kullanıldığı kanal da en son silinmiş mesajın içeriğini ve tarihini gösterir.",
    Kategori: "yönetim",
    Extend: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("messageDelete", async message => {
        if (message.channel.type === Discord.ChannelType.DM || !message.guild || message.author.bot) return;
        await Snipe.updateOne({ _id: message.channel.id }, { $set: {  
            "yazar": message.author.id, 
            "yazilmaTarihi": message.createdTimestamp,
            "silinmeTarihi": Date.now(), 
            "dosya": message.attachments.first() ? true : false,
	    "icerik": message.attachments.first() ? message.attachments.first().proxyURL : message.content ? message.content : "Boş Mesaj!"
          } }, { upsert: true })
    });
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.roles.cache.has(roller.boosterRolü) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.Yetkiler.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let mesaj = await Snipe.findById(message.channel.id)
    if (!mesaj) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    let mesajYazari = await client.users.fetch(mesaj.yazar);
    let embed = new genEmbed().setDescription(`Atan Kişi: ${mesajYazari}
Yazılma Tarihi: <t:${Number(String(mesaj.yazilmaTarihi).substring(0, 10))}:R>
Silinme Tarihi: <t:${Number(String(mesaj.silinmeTarihi).substring(0, 10))}:R> 
${mesaj.dosya ? "\n**Atılan mesaj dosya içeriyor**" : ""}`).setAuthor({ name: mesajYazari.username, iconURL: mesajYazari.avatarURL({ extension: "png"})})
    if (mesaj.icerik) embed.addFields({ name: 'Mesajın İçeriği', value: mesaj.icerik});
    if (mesaj.dosya) embed.setImage(mesaj.icerik)
    let carteldörtbin;
    if (mesaj.icerik) carteldörtbin = mesaj.icerik
    message.reply({embeds: [embed]}).then(x => setTimeout(() => {
        x.delete()
    }, 15000)).catch(err => { 
      message.reply({content: `${message.guild.members.cache.get(mesaj.yazar)} (\`${moment.duration(Date.now() - mesaj.yazilmaTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce yazılma / ${moment.duration(Date.now() - mesaj.silinmeTarihi).format("D [gün], H [saat], m [dakika], s [saniye]")} önce silinme\`) üyesi karakter sayısını aşan bir metin gönderdiği için **Discord API** buna izin vermedi, bende senin için dosya hazırladım.`, files: [{
          attachment: Buffer.from(carteldörtbin),
          name: `${mesaj.yazar}-snipe.txt`
      }]})
    });
    }
}