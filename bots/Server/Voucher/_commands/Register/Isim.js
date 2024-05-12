const { Client, Message} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

const Discord = require("discord.js")
module.exports = {
    Isim: "isim",
    Komut: ["i","nick"],
    Kullanim: "isim <@cartel/ID> <İsim/Nick>",
    Aciklama: "Belirtilen üyenin ismini ve yaşını güncellemek için kullanılır.",
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
    //if(!ayarlar.tag) return message.reply(cevaplar.ayarlamayok).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(x => setTimeout(() => {x.delete()}, 7500))
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(x => setTimeout(() => {x.delete()}, 7500))
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => setTimeout(() => {x.delete()}, 7500))
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    if(!isim) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let yas = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(ayarlar.isimyas && !yas) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if (ayarlar.isimyas && yas < ayarlar.minYaş) return message.reply(cevaplar.yetersizyaş).then(x => setTimeout(() => {x.delete()}, 7500))
    if(ayarlar.isimyas) {
            setName = `${isim} | ${yas}`;
    } else {
            setName = `${isim}`;
    }
    uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ``}${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
    var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
    let isimveri = await Users.findById(uye.id) || []
    let isimler = isimveri.Names ? isimveri.Names.length > 0 ? isimveri.Names.reverse().slice(0, 10).map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n") : "" : [] 
    uye.Rename(`${setName}`, message.member, "İsim Güncelleme")
    let isimLog = message.guild.kanalBul("isim-log")
    if(isimLog) isimLog.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin ismi ${message.member} tarafından \`${tarihsel(Date.now())}\` tarihinde "${ayarlar.isimyas ? `${isim} | ${yas}` : `${isim}`}" olarak güncellendi.`)]})
    message.reply({embeds: [new genEmbed().setDescription(`${uye} üyesinin ismi "${ayarlar.isimyas ? `${isim} | ${yas}` : `${isim}`}" olarak değiştirildi${isimveri.Names ? isimveri.Names.length > 0 ? 
        `, bu üye daha önce bu isimlerle kayıt olmuş.\n\n${uye} üyesinin toplamda **${isimveri.Names.length}** isim kayıtı bulundu.
__Aşağıda son 10 işlem listelenmekte__

${isimler}\n\nÖnceki isimlerine \`${sistem.botSettings.Prefixs[0]}isimler <@cartel/ID>\` komutuyla bakarak kayıt işlemini\n gerçekleştirmeniz önerilir.`
: "." : "."}`)]}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
    })

    }
};

