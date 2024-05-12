const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "şüpheliçıkart",
    Komut: ["unsuspend", "unsuspect"],
    Kullanim: "şüpheliçıkart <@cartel/ID> <Sebep>",
    Aciklama: "Belirtilen üye yeni bir hesapsa onu şüpheliden çıkartır.",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezakontrol = await Jail.findById(uye.id)
    if(cezakontrol) {
        message.channel.send(`${cevaplar.prefix} Belirtilen üye sistemsel tarafından cezalandırılmış, şüpheli çıkart komutu ile çıkartman münkün gözükmüyor.`).then(x => {
          setTimeout(() => {
            x.delete()
          }, 7500);
        });
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        return;
    };
    let User = await Users.findOne({_id: uye.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(uye && uye.manageable) await uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
        if(User.Gender == "Erkek") await uye.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") await uye.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri)
        if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü)
    } else {
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`)
        if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
    }
    let findChannel = message.guild.kanalBul("şüpheli-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin şüpheli durumu <t:${String(Date.now()).slice(0, 10)}:R> ${message.member} tarafından kaldırıldı.`)]})
    
    await message.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye şüpheli hesap konumundan çıkartıldı!`)]})
    .then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    })
    if(uye) uye.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye.user.username}, ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> şüpheliden çıkartıldın.`)]}).catch(x => {
      
    });
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
};