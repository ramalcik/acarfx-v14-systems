const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const ComponentUser = require('../../../../Global/Databases/Schemas/Users.Components');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yetki",
    Komut: ["yetkilianaliz","upstaff","staff","yetkikontrol","yetkiver","yetki-ver"],
    Kullanim: "yetki <@cartel/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && !roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!kullanıcı) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.guild.members.cache.get(kullanıcı.id);
    if (!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.id == message.member.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !ayarlar.staff.includes(message.member.id)) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined); 
    if(ayarlar.type && !uye.user.username.includes(ayarlar.tag)) return message.reply(cevaplar.taglıalım).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => uye.user.username.includes(x))) return message.reply({
      content: `Belirtilen üyenin üzerinde bir tag bulunmakta! Bu nedenden dolayı yetki işlemine devam edilemiyor. ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    let userData = await Users.findOne({_id: uye.id}) 
    let taglıUser = await userData ? userData.Taggeds ? `${userData.Taggeds.length}` || 0 : 0 : 0
    let compUser = await ComponentUser.findOne({_id: uye.id});
    let taglıGetirme =  compUser ? compUser.Checks ? `${compUser.Checks.filter(x => {
      let uye2 = message.guild.members.cache.get(x.target)
      return uye2 && uye2.user.username.includes(ayarlar.tag) && x.type == "TAG"
    }).length}` || 0 : 0 : 0
    let taglıGetirmeToplam = compUser ? compUser.Checks.filter(x => x.type == "TAG") ? `${compUser.Checks.filter(x => x.type == "TAG").length}` || 0 : 0 : 0
    let yetkiliGetirme =  compUser ? compUser.Checks ? `${compUser.Checks.filter(x => {
      let uye2 = message.guild.members.cache.get(x.target)
      return uye2 && roller.Yetkiler.some(b => uye2.roles.cache.has(b)) && x.type == "STAFF"
    }).length}` || 0 : 0 : 0
    let yetkiliGetirmeToplam = compUser ? compUser.Checks.filter(x => x.type == "STAFF") ? `${compUser.Checks.filter(x => x.type == "STAFF").length}` || 0 : 0 : 0
    let teyitUser = await userData ? userData.Records ? `${userData.Records.length}` || 0 : 0 : 0
    let yetkiliUser = await userData ? userData.Staffs ? `${userData.Staffs.length}` || 0 : 0 : 0
    let davetUser = await Invites.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0, total: 0 };
    let Upstaffs = await Upstaff.findOne({_id: uye.id})
    let data = await Stats.findOne({ userID: uye.id })
    
          let haftalikSesToplam = 0;
          let haftalikSesListe = '';
          let haftalikChatToplam = 0;
          let haftalikChatListe = '';
          let müzikToplam = 0;
  if(data) {
    if(data.voiceStats) {
      data.lifeVoiceStats.forEach((value, key) => {
            if(_statSystem.musicRooms.some(x => x === key)) müzikToplam += value
      });
      data.lifeVoiceStats.forEach(c => haftalikSesToplam += c);
      data.lifeVoiceStats.forEach((value, key) => { 
      if(_statSystem.voiceCategorys.find(x => x.id == key)) {
        let kategori = _statSystem.voiceCategorys.find(x => x.id == key);
        let kategoriismi = kategori.isim 
        haftalikSesListe += `\` • \` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
       }
      });
      if(müzikToplam && müzikToplam > 0) {
        haftalikSesListe += `\` • \` Müzik Odalar: \`${client.sureCevir(müzikToplam)}\``
      } else {
        haftalikSesListe += `\` • \` Müzik Odalar: \`0 dk.\``
      }
    }
    data.chatStats.forEach(c => haftalikChatToplam += c);
    data.lifeChatStats.forEach((value, key) => {
            if(key == _statSystem.generalChatCategory) haftalikChatListe = `\` • \` ${message.guild.channels.cache.has(key) ? `${ayarlar.serverName} Chat` ? `${ayarlar.serverName} Chat` : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj\``
    });
  
  }
  let rolBilgileri = []
  let rolLer = []
  let rolkitle = _statSystem.staffs
  if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x))) 
  rolkitle = _statSystem.staffs.filter(x => x.No <= Number(ayarlar.yükseltimSınırı))
  
  rolkitle.forEach((rol, index) => {
    let rolBilgi = message.guild.roles.cache.get(rol.rol)
    if(rolBilgi) {
        rolLer.push(rol.rol)
        rolBilgileri.push([
            {label: rolBilgi.name, value: rol.rol}
        ])
      
    }
})

  let button1 = new ButtonBuilder()
  .setCustomId('ykslt')
  .setLabel('⏫ Yükseltme' + ` ${Upstaffs ? '' : '(Yetki Seçilmeli)'}`)
  .setDisabled(Upstaffs ? false : true)
  .setStyle(ButtonStyle.Secondary)
  let button2 = new ButtonBuilder()
  .setCustomId('dsr')
  .setLabel('⏬ Düşürme' + ` ${Upstaffs ? '' : '(Yetki Seçilmeli)'}`)
  .setDisabled(Upstaffs ? false : true)
  .setStyle(ButtonStyle.Secondary)
  let button5 = new ButtonBuilder()
  .setCustomId('puanver')
  .setLabel(`Puan Ver/Al`)
  .setEmoji("739689170250891305")
  .setDisabled(Upstaffs ? Upstaffs.Yönetim ? true : false : true )
  .setStyle(ButtonStyle.Secondary)
  let button4 = new ButtonBuilder()
  .setCustomId('bilgilendirme')
  .setEmoji("963648489148022825")
  .setLabel('Yetkilendirme Geçmişi')
  .setStyle(ButtonStyle.Secondary)
  let button3 = new ButtonBuilder()
  .setCustomId('buttoniptal')
  .setLabel('Kapat')
  .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
  .setStyle(ButtonStyle.Danger)
  
  let rolMenu =  new StringSelectMenuBuilder()
  .setCustomId(`seç`)
  .setPlaceholder('Pratik yetkilendirme rolleri aşağıda listelenmektedir')
  .addOptions(rolBilgileri.reverse().slice(0, 25).map(rol => {
    return new Discord.StringSelectMenuOptionBuilder()
        .setLabel(rol.label) 
        .setValue(rol.value);
}))
  
  
  let satir1 = new ActionRowBuilder().addComponents(
      button1,
      button2,
      button5,
      button4,
      button3
  )
  
  let satir2 = new ActionRowBuilder().addComponents(
      rolMenu
  )

let msg;
if(!Upstaffs ) {
  let yetkiSalma = await Unleash.findOne({_id: uye.id})
  if(yetkiSalma) {
    if(yetkiSalma.unleashPoint >= 2 && !ayarlar.staff.includes(message.member.id)) {
      return message.reply({embeds: [new genEmbed().setFooter({ text: `${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`}).setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
        setTimeout(() => {
          x.delete()
        }, 12500);
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      })
    }
  }
  msg = await message.reply({content: `Belirlenen **${uye.user.username}** üyesi için işlem yükleniyor. Lütfen bekleyin!`})
  await msg.edit({content: `${uye} üyesi yetkili değil, yetki vermek istiyorsanız aşağıda ki menüden seçiniz!`, components: [satir2]})
} else {
  let yetkibul = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
  let altyetkisi =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkibul)-1];
  let üstyetkisi = _statSystem.staffs[_statSystem.staffs.indexOf(yetkibul)+1];
  let yetkiSalma = await Unleash.findOne({_id: uye.id})
  if(yetkiSalma) {
    if(yetkiSalma.unleashPoint >= 2 && !ayarlar.staff.includes(message.member.id)) {
      return message.reply({embeds: [new genEmbed().setFooter({ text: `${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`}).setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
        setTimeout(() => {
          x.delete()
        }, 12500);
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      })
    }
  }
  msg = await message.reply({content: `Belirlenen **${uye.user.username}** üyesi için işlem yükleniyor. Lütfen bekleyin!`})
  await msg.edit({ content: null, embeds: [embed.setThumbnail(uye.user.avatarURL({extension: 'png'})).setDescription(`Aşağıda ${uye} (\`${uye.id}\`) yetkilinin/yöneticinin analizleri detaylı bir şekilde belirtilmiştir.\n
**Yetkili Bilgileri**:
${userData ? userData.StaffGiveAdmin ? `\` ••❯ \` Yetkiye Başlatan: ${message.guild.members.cache.get(userData.StaffGiveAdmin) ? message.guild.members.cache.get(userData.StaffGiveAdmin) : `<@${userData.StaffGiveAdmin}>`}` : `\` ••❯ \` Sorumlusu: \`Belirlenmedi.\`` : `\` ••❯ \` Sorumlusu: \`Belirlenmedi.\``}
${Upstaffs ? Upstaffs.Baslama ? `\` ••❯ \` Yetkiye Başlama Tarihi: <t:${String(Date.parse(Upstaffs.Baslama)).slice(0, 10)}:R> (<t:${String(Date.parse(Upstaffs.Baslama)).slice(0, 10)}:F>)` : `\` ••❯ \` Yetkiye Başlama Tarihi: \`Belirlenemedi!\``: `\` ••❯ \` Yetkiye Başlama Tarihi: \`Belirlenemedi!\``}
${Upstaffs ? Upstaffs.Baslama ? `\` ••❯ \` Yetkide Kalma Süresi: \`${client.sureCevir(Date.now() - Date.parse(Upstaffs.Baslama))}\`` : `\` ••❯ \` Yetkide Kalma Süresi: \`Belirlenemedi!\``: `\` ••❯ \` Yetkide Kalma Süresi: \`Belirlenemedi!\``}
${Upstaffs ? Upstaffs.Rolde ? `\` ••❯ \` Rolde Kalma Süresi: \`${client.sureCevir(Date.now() - Upstaffs.Rolde)}\`` : `\` ••❯ \` Rolde Kalma Süresi: \`Belirlenemedi!\``: `\` ••❯ \` Rolde Kalma Süresi: \`Belirlenemedi!\``}
${Upstaffs ? Upstaffs.Görev >= 1 ? `\` ••❯ \` Yetki Görev Puanı: \`${Upstaffs.Görev} Görev Puanı\`\n` : `` : ``}${yetkibul ? `\` ••❯ \` Şuan ki Yetkisi: ${message.guild.roles.cache.get(yetkibul.rol) ? message.guild.roles.cache.get(yetkibul.rol) : uye.roles.hoist} ${Upstaffs.Yönetim ? "(\`Yönetim\`)" : "(\`Normal Yetkili\`)"}` : `` }
${yetkiSalma ? `\` ••❯ \` Yetki Salma Hakkı: \`${yetkiSalma.unleashPoint ? yetkiSalma.unleashPoint : 0} Hak\` ${yetkiSalma.unleashPoint >= 1 ? `(${yetkiSalma.unleashPoint == 1 ? `**Tolerans:** \`+1 Hak => %50.0\`` : `\`Hak Doldu!\``})
\` ••❯ \` Yetki Salmadan Önceki Rolleri:\n${yetkiSalma ? yetkiSalma.unleashRoles.map(x => `\` • \` ${message.guild.roles.cache.get(x)}`).join("\n") : `${message.guild.emojiGöster(emojiler.Onay)} Veritabanına bir rol veya bir veri bulunamadı!`}` : ``}\n` : ``}${altyetkisi ? `\` ⏬ \` **Düşürülme** İşleminde Alacağı Yetki: ${altyetkisi.rol ? message.guild.roles.cache.get(altyetkisi.rol)  : "@rol bulunamadı"}\n` : `` }${üstyetkisi ? `\` ⏫ \` **Yükseltilme** İşleminde Alacağı Yetki: ${üstyetkisi.rol ? message.guild.roles.cache.get(üstyetkisi.rol) : "@rol bulunamadı"}` : `` }

**Genel Toplantı Bilgileri**:
${userData.Meetings && userData.Meetings.filter(x => Number(Date.parse(Upstaffs.Baslama)) < Number(x.Date)).length > 0 ? `Aşağı da son 5 toplantının bilgileri baza alınmıştır. Bu yükseltim/düşüm işlemleri sizin insafiyetinize kalmış.
${userData.Meetings.filter(x => Number(Date.parse(Upstaffs.Baslama)) < Number(x.Date)).sort((a, b) => b.Date - a.Date).slice(0,5).map(x => `\` ${x.Meeting} \` ${message.guild.kanalBul(x.Channel) ? message.guild.channels.cache.get(x.Channel) : message.guild.channels.cache.get(kanallar.toplantıKanalı) ? message.guild.channels.cache.get(kanallar.toplantıKanalı) : "#deleted-channel" } <t:${String(x.Date).slice(0, 10)}:R> [**${x.Status}**]`).join("\n")}` : `Katıldığı veya katılmadığı hiç bir toplantı bulunamadı.`}

**Genel İstatistik Bilgileri**:
\` • \` Davet Bilgisi: \`${davetUser.regular <= 0 ? davetUser.regular : `0`}\`${ayarlar.type ? `\n\` • \` Taglı Bilgisi: \`${taglıUser}\`\n\` • \` Taglı İlgilenme Bilgisi: \`${taglıGetirme}\` (Toplam: \`${taglıGetirmeToplam}\`)` : ``}
\` • \` Kayıt Bilgisi: \`${teyitUser}\`
\` • \` Yetkili Bilgisi: \`${yetkiliUser}\`
\` • \` Yetkili İlgilenme Bilgisi: \`${yetkiliGetirme}\` (Toplam: \`${yetkiliGetirmeToplam}\`)
\` • \` Genel Ses Bilgisi: \`${client.sureCevir(haftalikSesToplam)}\`
${haftalikSesListe}
${haftalikChatListe}

`)],  components: [satir2, satir1] })

    
}

var filter = (button) => button.user.id === message.member.id;
let collector = await msg.createMessageComponentCollector({filter, errors: ["time"], time: 45000 })

    collector.on("collect", async (button) => {
      if(button.customId === "bilgilendirme") {
                const button1 = new ButtonBuilder()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle(ButtonStyle.Primary);
          const buttonkapat = new ButtonBuilder()
                .setCustomId('kapat')
                .setLabel('❌')
                .setStyle(ButtonStyle.Secondary);
          const button2 = new ButtonBuilder()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle(ButtonStyle.Primary);
          Users.findOne({_id: uye.id }, async (err, res) => {
          if (!res) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
          if(!res.StaffLogs) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
          let pages = res.StaffLogs.sort((a, b) => b.Date - a.Date).chunk(10);
          var currentPage = 1
          if (!pages && !pages.length || !pages[currentPage - 1]) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500)),button.deferUpdate().catch(err => {})
          let embed = new genEmbed().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, iconURL: message.guild.iconURL({extension: 'png'})})
          const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
          if (message.deferred == false){
          await message.deferReply()
          };
          const curPage = await msg.edit({
          embeds: [embed.setDescription(`${uye} yetkilinin yükseltim geçmiş bilgisi yükleniyor. Lütfen bekleyin...`)],
          components: [row], fetchReply: true,
          }).catch(err => {});

          await curPage.edit({embeds: [embed.setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamadı"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>)`).join("\n")}`)]}).catch(err => {})

          const filter = (i) => i.user.id == message.member.id

          const collector = await curPage.createMessageComponentCollector({
          filter,
          time: 30000,
          });

          collector.on("collect", async (i) => {
          switch (i.customId) {
          case "ileri":
            if (currentPage == pages.length) break;
            currentPage++;
            break;
          case "geri":
            if (currentPage == 1) break;
            currentPage--;
            break;
          default:
            break;
          case "kapat": 
            i.deferUpdate().catch(err => {});
            curPage.delete().catch(err => {})
            return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
          }
          await i.deferUpdate();
          await curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamadı"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>) `).join("\n")}`)]
          }).catch(err => {});
          collector.resetTimer();
          });
          collector.on("end", () => {
          if(curPage) curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin toplamda \`${res.StaffLogs.length || 0}\` adet yükseltim geçmiş bilgisi mevcut.`)],
          components: [],
          }).catch(err => {});
          })
          })


      }
      if(button.customId == "puanver") {
        msg.delete().catch(err => {})
        message.channel.send({embeds: [new genEmbed().setColor("Random").setDescription(`${uye} isimli yetkiliye vermek veya almak istediğiniz yetki puanını belirtiniz.`)]}).then(async (mesaj) => {
          var filter = (i) => i.author.id == message.member.id
          let collector = mesaj.channel.createMessageCollector({filter: filter, time: 60000, max: 1})
          collector.on('end', async (i) => {
            mesaj.delete().catch(err => {}).catch(err => {})
          })
          collector.on('collect', async (m) => {
            let puan = parseInt(m.content)
            if(isNaN(puan)) return mesaj.delete().catch(err => {}), m.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Puanı rakam veya da puan şeklinde belirtmediğinizden veya da puan girmediğinizden dolayı işleminiz iptal edildi.`, ephemeral: true});
            mesaj.delete().catch(err => {})
            let Rowcuk = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
              .setLabel("Ver")
              .setCustomId("verabimeyarrak")
              .setEmoji("943265806341513287")
              .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
              .setLabel("Al")
              .setEmoji("943265806547038310")
              .setCustomId("alabimdenyarrağı")
              .setDisabled(Number(Upstaffs.Point) < Number(puan) ? true : false)
              .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
              .setLabel("İşlemi İptal Et")
              .setCustomId("iptaletaq")
              .setStyle(ButtonStyle.Danger)
              .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
            )
            message.channel.send({embeds: [new genEmbed().setColor("Random").setDescription(`${uye} isimli yetkiliye \` ${puan} Yetki Puanı \` verilecek veya alınacak. Lütfen aşağıda ki düğmelerden seçiniz!`)], components: [Rowcuk]}).then(async (yarram) => {
              var filter = (i) => i.user.id == message.member.id
              let collector = yarram.createMessageComponentCollector({filter: filter, max: 1})
              collector.on('collect', async (i) => {
                if(i.customId == "verabimeyarrak") {
                  yarram.delete().catch(err => {})
                  await client.Upstaffs.addPoint(uye.id, Number(puan), "Bonus")
                  message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üyesine \` +${puan} Puan Etkisi \` işlemi uygulandı.`, ephemeral: true})
                  message.guild.kanalBul("terfi-log").send({embeds: [embed.setDescription(`${message.member} (\`${message.member.id}\`) isimli yönetici ${uye} (\`${uye.id}\`) isimli üyeye \` +${puan} Puan Etkisi \` yetki bonusu eklendi.`)]});
                } else if(i.customId == "alabimdenyarrağı") {
                  yarram.delete().catch(err => {})
                  await client.Upstaffs.addPoint(uye.id, Number(-puan), "Bonus")
                  message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üyesine \` -${puan} Puan Etkisi \` işlemi uygulandı.`, ephemeral: true})
                  message.guild.kanalBul("terfi-log").send({embeds: [embed.setDescription(`${message.member} (\`${message.member.id}\`) isimli yönetici ${uye} (\`${uye.id}\`) isimli üyeye \` -${puan} Puan Etkisi \` yetki bonusu kaldırıldı.`)]});
                } else if(i.customId == "iptaletaq") {
                  yarram.delete().catch(err => {})
                  i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla puan verme/alma işlemini iptal ettiniz.`, ephemeral: true})
                  message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
                }
              })
            })
          })
        })
      }
      if(button.customId === "dsr") {
        let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
        let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)-1];
        if(!rolBul) return button.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye en alt yetkide daha fazla düşüremezsin.`, ephemeral: true})
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        if(roller.altYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x)) || roller.yönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x)) || roller.üstYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x))) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
          Date: Date.now(),
          Process: "DÜŞÜRÜLME",
          Role: rolBul.rol,
          Author: message.member.id
        }}}, { upsert: true })
        await Upstaff.updateOne({_id: uye.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
        let newRoles = []
        uye.roles.cache.filter(x => yetkiBilgisi.rol != x.id && !yetkiBilgisi.exrol.includes(x.id)).map(x => newRoles.push(x.id))
        if(rolBul && rolBul.rol) {
          newRoles.push(rolBul.rol)
          if(rolBul.exrol && rolBul.exrol.length >= 1) newRoles.push(...rolBul.exrol)
        }
        uye.roles.set(newRoles)
           await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            Sorumluluk: 0,
            CompletedSorumluluk: false,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne düşürdü.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0, "Toplantı": 0, "Etkinlik": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne düşürüldü.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)})
          msg.delete().catch(err => {})
      }

      if(button.customId === "ykslt") {
        let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
        let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)+1];
        if(!rolBul) return button.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye son yetkiye ulaştığı için yükseltme işlemi yapılamaz.`, ephemeral: true})
        if(rolBul.No > ayarlar.yükseltimSınırı && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x))) return button.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye}, isimli üyeyi en fazla şuan ki yetkiye kadar yükseltebilirsin.`, ephemeral: true})
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        if(roller.altYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x)) || roller.yönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x)) || roller.üstYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x))) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        await Upstaff.updateOne({_id: uye.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
        await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
          Date: Date.now(),
          Process: "YÜKSELTİLME",
          Role: rolBul.rol,
          Author: message.member.id
        }}}, { upsert: true }) 
        let newRoles = []
        uye.roles.cache.filter(x => yetkiBilgisi.rol != x.id && !yetkiBilgisi.exrol.includes(x.id)).map(x => newRoles.push(x.id))
        if(rolBul && rolBul.rol) {
          newRoles.push(rolBul.rol)
          if(rolBul.exrol && rolBul.exrol.length >= 1) newRoles.push(...rolBul.exrol)
        }
        uye.roles.set(newRoles)
           await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            Sorumluluk: 0,
            CompletedSorumluluk: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne yükseltti.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0, "Toplantı": 0, "Etkinlik": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne yükseltildi.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)})
          msg.delete().catch(err => {})
      }


      if(button.customId === "seç") {
        let rolId = button.values[0] || roller.başlangıçYetki
        let rolBul = _statSystem.staffs.find(x => x.rol === rolId)

        if(Upstaffs && rolBul) {
          await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
            Date: Date.now(),
            Process: "GÜNCELLEME",
            Role: rolBul.rol,
            Author: message.member.id
          }}}, { upsert: true }) 
        } else if(!Upstaffs && rolBul) {
          uye.setNickname(uye.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})  
          await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
            Date: Date.now(),
            Process: "BAŞLATILMA",
            Role: rolBul ? rolBul.rol : roller.başlangıçYetki,
            Author: message.member.id
          }}}, { upsert: true }) 
          message.member.Leaders("yetki", _statSystem.points.staff, {type: "STAFF", user: uye.id})
        }
        if(!Upstaffs) {
          client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
          await Upstaff.updateOne({_id: uye.id}, { $set: {"Baslama": Date.now() }}, {upsert: true})
          await Users.updateOne({ _id: uye.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true });
                  await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: uye.id, Date: Date.now() } } }, { upsert: true });
                  let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
                  if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${uye} isimli üye \`${tarihsel(Date.now())}\` tarihinde ${message.author} tarafından yetkili olarak başlatıldı.`)]})   
        }
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        await Users.updateOne({_id: uye.id}, {$set: {"Staff": true}},{upsert: true})
        if(roller.altYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x) || rolBul.exrol.includes(x)) || roller.yönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x) || rolBul.exrol.includes(x)) || roller.üstYönetimRolleri.some(x => rolBul.rol == x || rolBul.exrol.includes(x) || rolBul.exrol.includes(x))) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        await Upstaff.updateOne({_id: uye.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
        let newRoles = []
        let checkRoles = []
        _statSystem.staffs.map(x => {
            if(x.rol) checkRoles.push(x.rol)
            if(x.exrol) x.exrol.map(ex => checkRoles.push(ex))
        })
        uye.roles.cache.filter(x => !checkRoles.includes(x.id)).map(x => newRoles.push(x.id))
        if(rolBul && rolBul.rol) {
            newRoles.push(rolBul.rol)
            if(rolBul.exrol && rolBul.exrol.length >= 1) newRoles.push(...rolBul.exrol)
        } 

        if(rolBul && !uye.roles.cache.has(rolBul.rol)) {
            await uye.roles.add(rolBul.rol)
            if(rolBul.exrol) setTimeout(async () => {
              await uye.roles.add(rolBul.exrol)
            }, 3000);
          }

          uye.roles.set(newRoles)
          await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            Sorumluluk: 0,
            CompletedSorumluluk: false,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne ekledi.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0, "Toplantı": 0, "Etkinlik": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne eklendi.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)})
          msg.delete().catch(err => {})
       }

      if(button.customId === "buttoniptal") {
          msg.delete().catch(err => {})
      }
    });

    collector.on("end", async () => {
      msg.delete().catch(x => {})
    });
    }
};

