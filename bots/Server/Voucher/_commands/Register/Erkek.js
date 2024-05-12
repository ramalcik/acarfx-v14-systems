const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {genEmbed} = require('../../../../Global/Init/Embed');
const Discord = require("discord.js")
module.exports = {
    Isim: "erkek",
    Komut: ["e","er"],
    Kullanim: "erkek @cartel/ID <isim/nick>",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
    Kategori: "teyit",
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
    if(ayarlar.dugmeliKayit) return;
    let regPanelEmbed = new genEmbed();
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uyarısıVar = await Punitives.findOne({Member: uye.id, Type: "Uyarılma"})
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(roller.erkekRolleri.some(x => uye.roles.cache.has(x))) return message.reply(cevaplar.kayıtlı).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kadınRolleri.some(x => uye.roles.cache.has(x))) return message.reply(cevaplar.kayıtlı).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(ayarlar.taglıalım && ayarlar.taglıalım != false && !uye.user.username.includes(ayarlar.tag) && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.taglıalım).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(ayarlar.teyitZorunlu && !uye.voice.channel  && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} **${ayarlar.serverName}** sunucusunda **Ses Teyit** zorunluluğu bulunduğundan dolayı ${uye} isimli üyenin kayıt işlemi \`${tarihsel(Date.now())}\` tarihinde iptal edildi.`)]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 15000);
    })
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yenihesap).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(uye.roles.cache.has(roller.şüpheliRolü) && uye.roles.cache.has(roller.jailRolü) && uye.roles.cache.has(roller.underworldRolü) &&  uye.roles.cache.has(roller.yasaklıTagRolü) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))   
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    if(!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(ayarlar.isimyas && !yaş) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (ayarlar.isimyas && yaş < ayarlar.minYaş) return message.reply(cevaplar.yetersizyaş).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ayarlar.isimyas) {
            setName = `${isim} | ${yaş}`;
    } else {
            setName = `${isim}`;
    }
    let cezaPuanı = await uye.cezaPuan()
    if(cezaPuanı >= 100 && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply({
        embeds: [new genEmbed().setDescription(`Belirlenen ${uye} isimli üyenin ceza puanı 100'ün üzerinde olduğu için kayıt işlemi alınamıyor. 
Bir itirazınız var ise ${roller.sorunÇözmeciler ? roller.sorunÇözmeciler.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ") : roller.altYönetimRolleri.filter(x => message.guild.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(", ")} rolü ve üstündeki rollerden herhangi bir yetkiliye ulaşınız ve durumu onlara da anlatınız.`)]
    }).then(x => { 
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 15000)
    })
    await message.reply({ embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye **Erkek** olarak kayıt edildi.`)], components: [] }).then(x => {
        setTimeout(() => {
            x.delete()
        }, 10000);
    })
    uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ``}${setName}`).catch(err => message.reply(cevaplar.isimapi));
    uye.Register(`${setName}`, "Erkek", message.member);
    client.Upstaffs.addPoint(message.member.id,_statSystem.points.record, "Kayıt")
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};