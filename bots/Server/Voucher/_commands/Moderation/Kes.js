const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Beklet = new Set();
const Discord = require("discord.js")
module.exports = {
    Isim: "kes",
    Komut: ["bağlantı-kes", "bkes"],
    Kullanim: "kes <@cartel/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sesten atar.",
    Kategori: "yetkili",
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

    if(!roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} \`Günlük Limit Aşıldı!\` ikiden fazla bağlantı kesme işlemi uygulandığı için.`).then(x => x.delete({timeout: 7500}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!uye) return message.channel.send(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let findChannel = message.guild.kanalBul("bkes-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} üyesi ${message.author} tarafından ${tarihsel(Date.now())} tarihinde ${uye.voice.channel ? uye.voice.channel : "#Kanal Bulunamadı"} belirtilen sesli kanalından atıldı.`)]})
    await uye.voice.disconnect()
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
  

    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !ayarlar.staff.includes(message.member.id)) Beklet.add(message.author.id);
        setTimeout(() => {
          Beklet.delete(message.author.id);
        }, 86400000);

    uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile <t:${String(Date.now()).slice(0, 10)}:R> bulunduğun sesten atıldın.`)]}).catch(x => {
      
  })
    }
};