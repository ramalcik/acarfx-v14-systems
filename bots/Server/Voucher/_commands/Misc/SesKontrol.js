const { Client, Message, EmbedBuilder, Guild } = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed')
const joinedAt = require('../../../../Global/Databases/Schemas/Others/Users.JoinedAt');
const moment = require('moment')
const Discord = require("discord.js")
module.exports = {
    Isim: "seskontrol",
    Komut: ["sesk", "n"],
    Kullanim: "seskontrol @cartel/ID",
    Aciklama: "Belirlenen üyenin seste aktif veya haporleri ve kulaklığının açık veya kapalı olduğunu gösterir.",
    Kategori: "yönetim",
    Extend: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("voiceStateUpdate", async (oldState, newState) => {
      if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
      if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ _id: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
      let joinedAtData = await joinedAt.findOne({ _id: oldState.id });
      if (!joinedAtData) await joinedAt.findOneAndUpdate({ _id: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
      joinedAtData = await joinedAt.findOne({ _id: oldState.id });
      if (oldState.channelId && !newState.channelId) {
        await joinedAt.deleteOne({ _id: oldState.id });
      } else if (oldState.channelId && newState.channelId) {
        await joinedAt.findOneAndUpdate({ _id: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
      }
    })
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async (client, message, args) => {
    let embed = new genEmbed()
    if(roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000)); 
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`${member} adlı kullanıcı herhangi bir ses kanalında değil.`)] });
            let joinedAtData = await joinedAt.findOne({ _id: member.id });
            let limit = member.voice.channel.userLimit || "~";
            let mic = member.voice.selfMute ? `Kapalı!` : `Açık!`
            let kulak = member.voice.selfDeaf ? `Kapalı!` : `Açık!`
            let ekran =  member.voice.streaming ? `Açık!` : `Kapalı!`
            let kamera = member.voice.selfVideo ? `Açık!` : `Kapalı!`
            message.channel.send({ embeds: [embed.setDescription(`${member}, isimli üye şuan da ${member.voice.channel} kanalında bulunuyor.

**Ses durumu**:
Mikrofon: \`${mic}\`
Kulaklık: \`${kulak}\`
Ekran: \`${ekran}\`
Kamera: \`${kamera}\`
Doluluk: \` ${member.voice.channel.members.size}/${limit} \`
Süre: \` ${joinedAtData ? moment.duration(joinedAtData ? Date.now() - joinedAtData.date : 0).format("H [saat], m [dakika] s [saniye]") : "Süre bulunamadı"} \`

**Ses kanalında bulunan üyeler**:
\`\`\`
${member.voice.channel.members.size <= 8 ? member.voice.channel.members.map(x => x.user.username).join("\n") : `${member.voice.channel.members.array().slice(0, 8).map(x => x.user.username).join("\n")} ve ${member.voice.channel.members.size - 8} kişi daha.`}
\`\`\``)] })
    }
};