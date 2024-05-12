const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder} = require("discord.js");
const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const voiceMute = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const ms = require('ms');
const { genEmbed } = require("../../../../Global/Init/Embed");
let selectSebep;
let selectMute;
const getLimitVoiceMute = new Map();
const getLimitMute = new Map()
const Discord = require("discord.js")
module.exports = {
    Isim: "mute",
    Komut: ["chatmute", "voicemute","sesmute","sustur","sessustur","vmute","cmute","metinsustur","chatsustur","v-mute","c-mute"],
    Kullanim: "mute <@cartel/ID>",
    Aciklama: "Belirlenen üyeyi ses ve metin kanallarında susturur.",
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
    if(!roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const sebeps = [
        { label: "Kışkırtma, Trol, Dalgacı ve Ortam Bozucu Davranış", description: "10 Dakika", emoji: {name: "1️⃣"} , value: "1", date: "10m", type: 5},
        { label: "Dizi, Film ve Hikayeler Hakkında Spoiler Vermek", description: "5 Dakika", emoji: {name: "2️⃣"} ,value: "2", date: "5m", type: 5},
        { label: "Küçümseyici Ve Aşalayıcı Davranış", description: "20 Dakika", emoji: {name: "3️⃣"} ,value: "3", date: "20m", type: 5},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "20 Dakika", emoji: {name: "4️⃣"} ,value: "4", date: "20m", type: 5},
        { label: "Ailevi Değerlere Küfür/Hakaret", description: "15 Dakika", emoji: {name: "5️⃣"} ,value: "5", date: "15m", type: 5},
        { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "30 Dakika", emoji: {name: "6️⃣"} ,value: "6", date: "30m", type: 5},
        { label: "Seste Yaşanan Olayları Chat'e Yansıtmak ve Uzatmak", description: "10 Dakika", emoji: {name: "7️⃣"} ,value: "7", date: "10m", type: 5},
        
        { label: "Kışkırtma, Trol, Dalgacı ve Ortam Bozucu Davranış", description: "10 Dakika", emoji: {name: "1️⃣"} , value: "8", date: "10m", type: 4},
        { label: "Küçümseyici Ve Aşalayıcı Davranış", description: "20 Dakika", emoji: {name: "2️⃣"} ,value: "9", date: "20m", type: 4},
        { label: "Özel Odalara Uyarılmalara Rağmen İzinsiz Giriş", description: "30 Dakika", emoji: {name: "3️⃣"} ,value: "10", date: "30m", type: 4},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "20 Dakika", emoji: {name: "4️⃣"} ,value: "11", date: "20m", type: 4},
        { label: "Soundpad, Efekt ve Ses Programları Kullanımı", description: "10 Dakika", emoji: {name: "5️⃣"} ,value: "12", date: "10m", type: 4},
        { label: "Ailevi Değerlere Küfür/Hakaret", description: "15 Dakika", emoji: {name: "6️⃣"} ,value: "13", date: "15m", type: 4},
        { label: `Ortamı (${ayarlar.serverName}) Kötülemek`, description: "30 Dakika", emoji: {name: "7️⃣"} ,value: "14", date: "30m", type: 4} 
    ]
    let chatMuteButton = new ButtonBuilder()
    .setCustomId(`chatmute`)
    .setLabel(`Metin Kanallarında ${roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? await Mute.findById(uye.id) ? `(Aktif Cezası Var!)` : getLimitMute.get(message.member.id) >= ayarlar.muteLimit ? `(Limit ${getLimitMute.get(message.member.id)}/${ayarlar.muteLimit})` : `${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? Number(ayarlar.muteLimit) ? `(Limit: ${getLimitMute.get(message.member.id) || 0}/${ayarlar.muteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? await Mute.findById(uye.id) ? true : getLimitMute.get(message.member.id) >= ayarlar.muteLimit ? true : false : true)
    let voiceMuteButton = new ButtonBuilder()
    .setCustomId(`voicemute`)
    .setLabel(`Ses Kanallarında ${roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? await voiceMute.findById(uye.id) ? `(Aktif Cezası Var!)` : getLimitVoiceMute.get(message.member.id) >= ayarlar.voiceMuteLimit ? `(Limit Doldu ${getLimitVoiceMute.get(message.member.id)}/${ayarlar.voiceMuteLimit})` : `${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? Number(ayarlar.voiceMuteLimit) ? `(Limit: ${getLimitVoiceMute.get(message.member.id) || 0}/${ayarlar.voiceMuteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) ? await voiceMute.findById(uye.id) ? true : getLimitVoiceMute.get(message.member.id) >= ayarlar.voiceMuteLimit ? true : false : true)
    let iptalButton =  new ButtonBuilder()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
    .setStyle(ButtonStyle.Danger)
    let muteOptions = new ActionRowBuilder().addComponents(
            chatMuteButton,
            voiceMuteButton,
            iptalButton,
    );

    let msg = await message.reply({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`Belirtilen ${uye} isimli üyeyi hangi türde susturmak istiyorsun?`)], components: [muteOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `chatmute`) {
        selectMute = 5
        i.update({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`Belirlenen ${uye} isimli üyesini hangi sebep ile **metin kanallarından** susturmamı istiyorsun?`)],  components: [
            new ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId(`sebep`)
                    .setPlaceholder(`${uye.user.username} için ceza sebebi belirtin!`)
                    .addOptions(sebeps.filter(x => x.type === 5).map(opt => {
                        return new Discord.StringSelectMenuOptionBuilder()
                            .setLabel(opt.label)
                            .setDescription(opt.description)
                            .setEmoji(opt.emoji)
                            .setValue(opt.value);
                    }))
            )
        ]
    })}
        if (i.customId === `voicemute`) {
            selectMute = 4
            i.update({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`Belirlenen ${uye} isimli üyesini hangi sebep ile **ses kanallarından** susturmamı istiyorsun?`)], components: [
                new ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`sebep`)
                        .setPlaceholder(`${uye.user.username} için ceza sebebi belirtin!`)
                        .addOptions(sebeps.filter(x => x.type === 12).map(opt => {
                            return new Discord.StringSelectMenuOptionBuilder()
                                .setLabel(opt.label)
                                .setDescription(opt.description)
                                .setEmoji(opt.emoji)
                                .setValue(opt.value);
                        }))
                )
            ]
        })}
        if (i.customId === `sebep`) {
           let seçilenSebep = sebeps.find(x => x.value == i.values[0])
           if(seçilenSebep) {
               if(selectMute == 4) {
                if(Number(ayarlar.voiceMuteLimit)) {
		let voiceMuteCheck = await voiceMute.findById(uye.id)
		if(voiceMuteCheck) return await i.reply({content: `Belirtiğin ${uye} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
                    if(!message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                        getLimitVoiceMute.set(`${message.member.id}`, (Number(getLimitVoiceMute.get(`${message.member.id}`) || 0)) + 1)
                            setTimeout(() => {
                                getLimitVoiceMute.set(`${message.member.id}`, (Number(getLimitVoiceMute.get(`${message.member.id}`) || 0)) - 1)
                            },1000*60*5)
                        }
                    }
                }
               if(selectMute == 5) {
		let chatMuteCheck = await Mute.findById(uye.id)
		if(chatMuteCheck) return await i.reply({content: `Belirtiğin ${uye} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
                if(Number(ayarlar.muteLimit)) {
                    if(!message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                        getLimitMute.set(`${message.member.id}`, (Number(getLimitMute.get(`${message.member.id}`) || 0)) + 1)
                            setTimeout(() => {
                                getLimitMute.set(`${message.member.id}`, (Number(getLimitMute.get(`${message.member.id}`) || 0)) - 1)
                            },1000*60*5)
                        }
                    }
                }
                i.deferUpdate()  
                msg.delete().catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
              return uye.addPunitives(seçilenSebep.type, message.member, seçilenSebep.label, message, seçilenSebep.date)
        } else {
               return i.update({components: [], embeds: [ new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
           }
         }
        if (i.customId === `iptal`) {
            msg.delete().catch(err => {})
            return await i.reply({ content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla mute işlemleri menüsü kapatıldı.`, components: [], embeds: [], ephemeral: true });
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

    }
};



function yetkiKontrol(message, type = 0) {
    if(type = 1) if(roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return true
    
    if(type = 2) if(roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return true
}