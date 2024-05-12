const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
const getLimit = new Map();

const Discord = require("discord.js")
module.exports = {
    Isim: "yargı",
    Komut: ["yargi","yargila","yargıla"],
    Kullanim: "yargı <@cartel/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sunucudan uzaklaştırır.",
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
    if(!ayarlar && !roller && !roller.banHammer || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.reply(cevaplar.notSetup)
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    let sunucudabul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul && sunucudabul.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul && message.member.roles.highest.position <= sunucudabul.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul && roller.Yetkiler.some(oku => sunucudabul.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.yetkilinoban); 
    if(getLimit.get(message.member.id) >= ayarlar.banLimit) return message.reply(cevaplar.bokyolu).then(s => setTimeout(() => s.delete().catch(err => {}), 7500));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(sunucudabul) {
        uye.removeStaff()
        uye.dangerRegistrant()
        uye.addPunitives(2, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    } else {
        let cezano = await Punitives.countDocuments()
        cezano = cezano == 0 ? 1 : cezano + 1;
        let ceza = new Punitives({ 
            No: cezano,
            Member: uye.id,
            Staff: message.member.id,
            Type: "Yasaklama",
            Reason: sebep,
            Date: Date.now()
        })
        ceza.save().catch(err => {})
        let findedChannel = message.guild.kanalBul("ban-log")
        if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter({ text: `${message.guild.name ? `${message.guild.name} •` : ''} Ceza Numarası: #${cezano}`, iconURL: message.guild.name ? message.guild.iconURL({extension: 'png'}) : uye.avatarURL({extension: 'png'})}).setDescription(`${uye.toString()} üyesine, <t:${String(Date.now()).slice(0, 10)}:R> \`${sebep}\` nedeniyle ${message.member} tarafından ceza-i işlem uygulandı.`)]})
        await message.channel.send(`${message.guild.emojiGöster(emojiler.Yasaklandı)} ${uye.toString()} isimli üyeye \`${sebep}\` sebebiyle "__Yasaklama__" türünde ceza-i işlem uygulandı. (\`Ceza Numarası: #${cezano}\`)`)
        await message.guild.members.ban(uye.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
        await Users.updateOne({ _id: message.member.id } , { $inc: { "Uses.Ban": 1 } }, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
    }
    if(Number(ayarlar.banLimit)) {
        if(!message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
            getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
            setTimeout(() => {
                getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
            },1000*60*5)
        }
    }
    }
};

  