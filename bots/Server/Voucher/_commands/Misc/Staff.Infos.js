const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "yetkilidurum",
    Komut: ["yetkili-ses","ses-yetkili","yetkili-durum","yetkilisay","yetkili-say","ysay"],
    Kullanim: "yetkilisay",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000)); 
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel("Aktif Seste Olmayanlar")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("aktifseste"),
        new ButtonBuilder()
        .setLabel("Toplam Seste Olmayanlar")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("toplam"),
        new ButtonBuilder()
         .setLabel(`Toplam Yetkili Bilgisi`)
         .setStyle(ButtonStyle.Success)
         .setDisabled(false)
         .setCustomId("testt")
    )
    message.channel.send({embeds: [new genEmbed().setDescription(`Aşağıda bulunan düğmelerden yetkili aktifliğinin filtresini seçiniz.`)], components: [Row]}).then(async (msg) => {
        var filter = (i) => i.user.id == message.member.id
        let collector = msg.createMessageComponentCollector({filter: filter, max: 1})
        collector.on("collect", async (i) => {
            if(i.customId == "testt"){
                let Aloo = []
                let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                if(altyetkiler) altyetkiler.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)).map(uye => {
                    if(!Aloo.includes(uye.id)) Aloo.push(uye.id)
                })
                                     
                                         roller.altYönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)).forEach(uye => {
                                              if(!Aloo.includes(uye.id)) Aloo.push(uye.id)
                                             })
                                         })
                                         roller.yönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)).forEach(uye => {
                                              if(!Aloo.includes(uye.id)) Aloo.push(uye.id)
                                             })
                                         })
                                     
                                         roller.üstYönetimRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)).forEach(uye => {
                                              if(!Aloo.includes(uye.id)) Aloo.push(uye.id)
                                             })
                                         })
                                         roller.kurucuRolleri.some(x => {
                                             let rol = message.guild.roles.cache.get(x)
                                             rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) ).forEach(uye => {
                                              if(!Aloo.includes(uye.id)) Aloo.push(uye.id)
                                             })
                                         })
                                         message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} Aşağı da **${message.guild.name}** sunucusunun bulunan tüm yetkilileri listelenmektedir. (Yetkili sayısı: **${Aloo ? Aloo.length : 0}**)`).then(x => {
                                            const arr = splitMessages(`${Aloo.length >= 1 ? Aloo.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                                            arr.forEach(element => {
                                                message.channel.send(element);
                                            });
                                          })
            }
            if(i.customId == "aktifseste") {
                let GUILD_MEMBERS = await client.guilds.cache.get(message.guild.id).members.fetch({ withPresences: true })

                            let Genel = []
                             let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                             if(altyetkiler) altyetkiler.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)  && uye.presence && uye.presence?.status !== "offline" && !uye.voice.channel).map(uye => {
                                if(!Genel.includes(uye.id)) Genel.push(uye.id)
                             })
                         
                             roller.altYönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.presence && uye.presence?.status !== "offline" && !uye.voice.channel).forEach(uye => {
                                  if(!Genel.includes(uye.id)) Genel.push(uye.id)
                                 })
                             })
                             roller.yönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.presence && uye.presence?.status !== "offline" && !uye.voice.channel).forEach(uye => {
                                  if(!Genel.includes(uye.id)) Genel.push(uye.id)
                                 })
                             })
                         
                             roller.üstYönetimRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.presence && uye.presence?.status !== "offline"  && !uye.voice.channel).forEach(uye => {
                                  if(!Genel.includes(uye.id)) Genel.push(uye.id)
                                 })
                             })
                             roller.kurucuRolleri.some(x => {
                                 let rol = message.guild.roles.cache.get(x)
                                 rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && uye.presence && uye.presence?.status !== "offline" && !uye.voice.channel).forEach(uye => {
                                  if(!Genel.includes(uye.id)) Genel.push(uye.id)
                                 })
                             })
                         
                             //
                         
                             message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} Aşağı da aktif fakat seste olmayan **${message.guild.name}** sunucusunun tüm yetkilileri listelenmektedir. (Seste olmayan yetkili sayısı: **${Genel ? Genel.length : 0}**)`).then(x => {
                               const arr = splitMessages(`${Genel.length >= 1 ? Genel.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                               arr.forEach(element => {
                                   message.channel.send(element);
                               });
                             })
            }
            if(i.customId == "toplam") {

                let Genel = []
                 let altyetkiler = message.guild.roles.cache.get(roller.altilkyetki)
                 if(altyetkiler) altyetkiler.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)   && !uye.voice.channel).map(uye => {
                    if(!Genel.includes(uye.id)) Genel.push(uye.id)
                 })
             
                 roller.altYönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)   && !uye.voice.channel).forEach(uye => {
                      if(!Genel.includes(uye.id)) Genel.push(uye.id)
                     })
                 })
                 roller.yönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && !uye.voice.channel).forEach(uye => {
                      if(!Genel.includes(uye.id)) Genel.push(uye.id)
                     })
                 })
             
                 roller.üstYönetimRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri)   && !uye.voice.channel).forEach(uye => {
                      if(!Genel.includes(uye.id)) Genel.push(uye.id)
                     })
                 })
                 roller.kurucuRolleri.some(x => {
                     let rol = message.guild.roles.cache.get(x)
                     rol.members.filter(uye => !uye.user.bot && !uye.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !uye.roles.cache.has(roller.kurucuRolleri) && !uye.voice.channel).forEach(uye => {
                      if(!Genel.includes(uye.id)) Genel.push(uye.id)
                     })
                 })
             
                 //
             
                 message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} Aşağı da seste olmayan **${message.guild.name}** sunucusunun tüm yetkilileri listelenmektedir. (Seste olmayan yetkili sayısı: **${Genel ? Genel.length : 0}**)`).then(x => {
                   const arr = splitMessages(`${Genel.length >= 1 ? Genel.map(x => `<@${x}>`).join(", ") : "Tebrikler! Tüm yetkilileriniz seste."}`, { maxLength: 1950, char: "," });
                   arr.forEach(element => {
                       message.channel.send(element);
                   });
                 })
            }
        })
        collector.on("end", i => {
            msg.delete().catch(err => {})
        })
    })

    function splitMessages(text, options = {}) {
        const maxLength = options.maxLength || 2000;
        const char = options.char || "\n";
        const messages = [];
        
        const lines = text.split(char);
        let currentMessage = "";
        let currentLength = 0;
        
        for (const line of lines) {
          if (currentLength + line.length + char.length <= maxLength) {
            currentMessage += line + char;
            currentLength += line.length + char.length;
          } else {
            messages.push(currentMessage);
            currentMessage = line + char;
            currentLength = line.length + char.length;
          }
        }
        
        if (currentMessage.length > 0) {
          messages.push(currentMessage);
        }
        
        return messages;
      }
    }
}







