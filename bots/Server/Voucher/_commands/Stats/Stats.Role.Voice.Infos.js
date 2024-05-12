const { EmbedBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const Discord = require("discord.js")
module.exports = {
    Isim: "voicedenetim",
    Komut: ["sesdenetim","rolstatdenetim"],
    Kullanim: "sesdenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin public, register ve genel ses denetimini sağlar.",
    Kategori: "stat",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
    if (rol.members.size === 0) return message.reply({content: `${cevaplar.prefix} Belirtilen rolde üye bulunamadığından işlem iptal edildi.`, ephemeral: true }),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    let Sesdenetim =  await Stats.find({guildID: message.guild.id});
    Sesdenetim = Sesdenetim.filter(s => message.guild.members.cache.has(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
    let PublicListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.publicKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');
    
    let StreamerListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.streamerKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.streamerKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');

    let RegisterListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) uye2Toplam += x
        });
        let uye1Toplam = 0;
        uye1.voiceStats.forEach((x, key) => {
            if(key == kanallar.registerKategorisi) uye1Toplam += x
        });
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach((x, key) => { if(key == kanallar.registerKategorisi) uyeToplam += x });
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');

    let SesListele = Sesdenetim.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        uye2.voiceStats.forEach(x => uye2Toplam += x);
        let uye1Toplam = 0;
        uye1.voiceStats.forEach(x => uye1Toplam += x);
        return uye2Toplam-uye1Toplam;
    }).slice(0, 15).map((m, index) => {
        let uyeToplam = 0;
        m.voiceStats.forEach(x => uyeToplam += x);
        return `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\``;
    }).join('\n');


    await message.channel.send({embeds: [embed.setDescription(`${rol} (\`${rol.id}\`) rolüne sahip ilk 15 üyenin ses bilgileri aşağıda listelenmekte.`)
    .addFields(
        {name: "Toplam Sıralama", value: SesListele ? SesListele : "Veri Bulunamadı.", inline: true},
        {name: "Public Sıralaması", value: PublicListele ? PublicListele : "Veri Bulunamadı.", inline: true},
        {name: "Register Sıralaması", value: RegisterListele ? RegisterListele : "Veri Bulunamadı.", inline: true},
        {name: "Streamer Sıralaması", value: StreamerListele ? StreamerListele : "Veri Bulunamadı.", inline: false}
    )]})
  }
};