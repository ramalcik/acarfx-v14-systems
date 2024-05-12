const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "unjail",
    Komut: ["cezalıçıkart", "cezalıçıkart"],
    Kullanim: "unjail <#No/@cartel/ID>",
    Aciklama: "Belirlenen üyeyi cezalıdan çıkartır.",
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
    if(Number(args[0])) {
      let cezanobul = await Jail.findOne({No: args[0]});
      if(cezanobul) args[0] = cezanobul._id
    }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let cezakontrol = await Jail.findById(uye.id)
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        return;
    };
    let cezabilgisi = await Punitives.findOne({ Member: uye.id, Active: true, Type: "Cezalandırılma" })
    if(cezabilgisi && cezabilgisi.Staff !== message.author.id && message.guild.members.cache.get(cezabilgisi.Staff) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && (roller.sorunÇözmeciler && !roller.sorunÇözmeciler.some(x => message.member.roles.cache.has(x))) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) 
    return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${cezabilgisi.Staff ? message.guild.members.cache.get(cezabilgisi.Staff) ? `${message.guild.members.cache.get(cezabilgisi.Staff)} (\`${cezabilgisi.Staff}\`)` : `${cezabilgisi.Staff}` :  `${cezabilgisi.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter({ text: "yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir."})]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    await Jail.deleteOne({ _id: uye.id })
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true })
    let User = await Users.findOne({_id: uye.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
        if(User.Gender == "Erkek") uye.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") uye.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri)
        if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü)
    } else {
        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`)
        if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
        uye.setRoles(roller.kayıtsızRolleri)
    }
    if(!User) {
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`)
        if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`)
        if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
    }
    await message.reply(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı cezalandırılması kaldırıldı!`).then(x => {setTimeout(() => {
        x.delete()
    }, 10750)});;;
    if(uye) uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> \`#${cezakontrol.No}\` ceza numaralı cezalandırılması kaldırıldı!`)]}).catch(x => {
      
    });
    let findChannel = message.guild.kanalBul("jail-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin \`#${cezakontrol.No}\` numaralı cezalandırılması <t:${String(Date.now()).slice(0, 10)}:R> ${message.member} tarafından kaldırıldı.`)]})
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    message.member.Leaders("ceza", 5, {type: "CEZA", user: uye.id})
    message.member.Leaders("sorun", 5, {type: "CEZA", user: uye.id})
    message.member.Leaders("criminal", 5, {type: "CEZA", user: uye.id})
    }
};