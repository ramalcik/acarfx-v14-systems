const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const Seens = require('../../../../Global/Databases/Schemas/Guild.Users.Seens');
const moment = require('moment');
const Sorumluluk = require('../../../../Global/Databases/Schemas/Plugins/Guild.Responsibility');
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');
const Discord = require("discord.js")
module.exports = {
  Isim: "terfi",
    Komut: ["yetkim","ystat","yetkilistat","görev","görevim","görevlerim","tasks","task"],
    Kullanim: "yetkim <@cartel/ID>",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "stat",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.saatDakikaCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika]'); };
    client.cartelSaatYap = (date) => { return moment.duration(date).format('H'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let barSystem = [
      {id: "mavi", başlamaBar: "mavibas", doluBar: "maviorta", doluBitişBar: "mavison", boşBitişBar: emojiler.Terfi.boşBitişBar , boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "red", başlamaBar: "redbas", doluBar: "redorta", doluBitişBar: "redson", boşBitişBar: emojiler.Terfi.boşBitişBar, boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "sari", başlamaBar: "saribas", doluBar: "sariorta", doluBitişBar: "sarison", boşBitişBar: emojiler.Terfi.boşBitişBar , boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "yesil", başlamaBar: "yesilbas", doluBar: "yesilorta", doluBitişBar: "yesilson", boşBitişBar: emojiler.Terfi.boşBitişBar , boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "turkuaz", başlamaBar: "turkuazbas", doluBar: "turkuazorta", doluBitişBar: "turkuazson", boşBitişBar: emojiler.Terfi.boşBitişBar, boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "standart", başlamaBar: "başlamaBar", doluBar: "doluBar", doluBitişBar: "doluBitişBar", boşBitişBar: emojiler.Terfi.boşBitişBar, boşBar: emojiler.Terfi.boşBar, başlangıçBar: emojiler.Terfi.başlangıçBar},
      {id: "diger", başlamaBar: "cartel_baslangicbar", doluBar: "cartel_dolubar", doluBitişBar: "cartel_dolubitisbar", boşBitişBar:"cartel_bosbitis", boşBar: "cartel_bosbar", başlangıçBar: "cartel_bosbaslama"},
    ]
    if(!_statSystem.system) return; 
    let kullArray = message.content.split(" ");
    let kullaniciId = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullaniciId[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullaniciId.slice(0).join(" ") || x.user.username === kullaniciId[0]) || message.member;

    if(uye && (ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => uye.user.username.includes(x))) return message.reply({
      content: `Belirtilen üyenin üzerinde bir tag bulunmakta! ${cevaplar.prefix}`
    }).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 7500);
    })
    if (!_statSystem.staffs.some(x => message.member.roles.cache.has(x.rol)) && !roller.üstYönetimRolleri.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator))  return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
   // if(message.member.roles.cache.has(_statSystem.endstaff) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.channel.send(`${cevaplar.prefix} \`Zaten son alt yetkidesin, bütün emeklerin için teşşekür ederiz.\``);
    const puanBilgisi = await Upstaffs.findOne({ _id: uye.id })
    const davetbilgisi = await InviteData.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0, total: 0 };
   // const eskiRolcük = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol) ))] || _statSystem.staffs[_statSystem.staffs.length-1];
   // const görevBilgisi = await Tasks.findOne({ Users: uye.id }) || await Tasks.findOne({ roleID: eskiRolcük ? eskiRolcük.rol : uye.roles.hoist.id  })
    Stats.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, data) => {
      if(!puanBilgisi) return message.reply(cevaplar.data).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        const yeniRol = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => x.No == (puanBilgisi ? puanBilgisi.staffNo : 0)))] || _statSystem.staffs[_statSystem.staffs.length-1];
        const eskiRol = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => x.No == (puanBilgisi ? puanBilgisi.staffExNo : 0)))] || _statSystem.staffs[_statSystem.staffs.length-1];
        const puanBelirt = _statSystem.staffs.find(x => x.No == puanBilgisi.staffNo) ? _statSystem.staffs.find(x => x.No == puanBilgisi.staffNo).Puan : eskiRol.Puan
        const puanBari = _statSystem.staffs.some(x => uye.roles.cache.has(x.rol)) && _statSystem.staffs.length > 0 ? `\`%${Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0, puanBelirt, 6, puanBilgisi.Point.toFixed(1))} \`${puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0} / ${puanBelirt}\`` : "";
        let siralamabul = await Upstaffs.find({})
        let yetkilicezanotu = await uye.yetkiliCezaPuan()
        let belirt = ayarlar._staffs.sort((a, b) => {
          let a_rol = message.guild.roles.cache.get(a.rol)
          let b_rol = message.guild.roles.cache.get(b.rol)
          if(a_rol && b_rol) return b_rol.rawPosition - a_rol.rawPosition
          })
          
        let bulundugurol =  belirt.indexOf(belirt.find(x => x.rol == eskiRol.rol))
        let ToplamPuan = Number(0) 
        _statSystem.staffs.filter(x => x.Puan).forEach(x => {
        ToplamPuan += Number(x.Puan)
        })
        const genelpuanBari = _statSystem.staffs.some(x => uye.roles.cache.has(x.rol)) && _statSystem.staffs.length > 0 ? `\`%${Math.floor((puanBilgisi.ToplamPuan)/ToplamPuan*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0, ToplamPuan, 6, puanBilgisi.ToplamPuan.toFixed(1))} \`${puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0} / ${ToplamPuan}\`` : "";
        
        let cezapuanoku = await uye.cezaPuan()
        let teyitoku = await Users.findOne({ _id: uye.id })
        let teyitbilgi;
        if(teyitoku) {
            if(teyitoku.Records) {
                    let erkekteyit = teyitoku.Records.filter(v => v.Gender === "Erkek").length
                    let kadınteyit = teyitoku.Records.filter(v => v.Gender === "Kadın").length
                    let toplamteyit = teyitoku.Records.length
                    teyitbilgi = `+${toplamteyit * _statSystem.points.record} Puan`
                } else { teyitbilgi = `0 Puan` }
            } else {
                teyitbilgi = `0 Puan`
        }
        let taglıÇek = await teyitoku ? teyitoku.Taggeds ? teyitoku.Taggeds.length || 0 : 0 : 0
        let yetkidurumu;
        if(yeniRol) yetkidurumu = `Şu an <@&${eskiRol.rol}> rolündesiniz. bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? yeniRol.exrol.filter(x => !uye.roles.cache.has(x)).length >= 1 ? `(${yeniRol.exrol.filter(x => !uye.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(",")}) rolerine` : "rolüne" : " rolüne"} ulaşmak için \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\` puan kazanmanız gerekiyor.`
        if(yeniRol.rol == eskiRol.rol) yetkidurumu = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
        if(roller.kurucuRolleri.some(x => uye.roles.cache.has(x))) yetkidurumu = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
        let siralases = '';
        let siralamesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${ayarlar.serverName} Chat Puan: \`0 mesaj\``
        let siralaMusicPuan = 0
        let simdises = '';
        let simdimesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${ayarlar.serverName} Chat Puan: \`0 mesaj\``
        let simdiMusicPuan = 0
        let simdiMusicDurma = 0
        if(data) {
            puanBilgisi.ToplamSesListe.forEach((value, key) => {
              if(_statSystem.musicRooms.some(x => x === key)) siralaMusicPuan += value
                    let kategori = _statSystem.voiceCategorys.find(x => x.id == key)
		    if(kategori) {
                     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.ToplamSesListe) puanBilgisi.ToplamSesListe.forEach((v, k) => { if(k == key) puan = v })
                     siralases += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`+${Number(puan).toFixed(1)} Puan\`\n`
            	    }
            })
            if(siralaMusicPuan && siralaMusicPuan > 0) siralases += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`+${Number(siralaMusicPuan).toFixed(1)} Puan\`\n`
            data.chatStats.forEach((value, key) => {
                if(key == _statSystem.generalChatCategory) siralamesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? `${ayarlar.serverName} Chat Puan` ? `${ayarlar.serverName} Chat Puan` : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``
            });
            data.upstaffVoiceStats.forEach((value, key) => {
              if(_statSystem.accessPointChannels.some(x => x == key)) {
                if(_statSystem.musicRooms.some(x => x === key)) simdiMusicDurma += value    
                    
                  
                    let kategori = _statSystem.voiceCategorys.find(x => x.id == key)
                    if(kategori) {
		     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.Ses) puanBilgisi.Ses.forEach((v, k) => { 
                      if(_statSystem.musicRooms.some(x => x === k)) simdiMusicPuan += v
                      if(k == key) puan = v
                      })
                     simdises += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`${client.saatDakikaCevir(value)} (Puan Etkisi: +${Number(puan).toFixed(1)})\`\n`
                    }
                }
            })
            if(simdiMusicDurma && simdiMusicDurma > 0) simdises += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`${client.saatDakikaCevir(simdiMusicDurma)} (Puan Etkisi: +${Number(simdiMusicPuan).toFixed(1)})\`\n`
            data.upstaffChatStats.forEach((value, key) => {
                if(key == _statSystem.generalChatCategory) simdimesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? `${ayarlar.serverName} Chat Puan` ? `${ayarlar.serverName} Chat Puan` : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Mesaj.toFixed(1) : 0})\``
            });
        } 

        let sorumlu = await Sorumluluk.find({})
        let Datacik = await Users.findOne({_id: uye.id})
        sorumlu = sorumlu.filter(x => uye.roles.cache.has(x.role))

        let liderlikler = sorumlu.filter(x => x.name.includes("Lider") || x.name.includes("lider"))
        let sorumluluklar = sorumlu.filter(x => x.name.includes("Sorumlu") || x.name.includes("sorumlu") || x.name.includes("Sorumlusu") || x.name.includes("sorumlusu"))
        let diğerler = sorumlu.filter(x => !x.name.includes("Sorumlu") && !x.name.includes("sorumlu") && !x.name.includes("Sorumlusu") && !x.name.includes("sorumlusu") && !x.name.includes("Lider") && !x.name.includes("lider"))
        let genelsorumluluklar = []
        liderlikler.map(x =>  genelsorumluluklar.push(x.name))
        sorumluluklar.map(x =>  genelsorumluluklar.push(x.name))
        diğerler.map(x => genelsorumluluklar.push(x.name))
        let durumbelirt = '';
        let durumcuk = Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)
        if(durumcuk < 60)  durumbelirt = `Devam etmelisin (Kalan: %${Number(100) - Number(durumcuk).toFixed(1)})`
        if(durumcuk >= 60)  durumbelirt = `Biraz daha çabala (Kalan: %${Number(100) - Number(durumcuk).toFixed(1)})`
        if(durumcuk >= 80)  durumbelirt = `Tamamlamalamak üzeresiniz (Kalan: %${Number(100) - Number(durumcuk).toFixed(1)})`
        let genelKatilim =  Datacik.Meetings ? Datacik.Meetings.sort((a, b) => b.Date - a.Date).filter(x => x.Status && x.Meeting != "BİREYSEL" && x.Status == "KATILDI") : []
        let bireyselKatilim =  Datacik.Meetings ? Datacik.Meetings.sort((a, b) => b.Date - a.Date).filter(x => x.Status && x.Meeting == "BİREYSEL" && x.Status == "KATILDI") : []
        let SonGörülme = await Seens.findOne({userID: uye.id}) 
        let sonMesaj = SonGörülme ? SonGörülme.lastMessage ? `<t:${String(SonGörülme.lastMessage).slice(0, 10)}:R>` : `Tespit Edilmedi` : `Tespit Edilmedi`
        let sonSes = SonGörülme ? SonGörülme.lastVoice ? uye.voice && uye.voice.channel ? `${uye.voice.channel}` : `<t:${String(SonGörülme.lastVoice).slice(0, 10)}:R>` : `Tespit Edilmedi` : `Tespit Edilmedi`
        let siralamacik = 0
        let geçildic = 1
        siralamabul.filter(x => message.guild.members.cache.has(x._id)).sort((a, b) => b.ToplamPuan - a.ToplamPuan).forEach((veri, index) => {
          if(veri._id == uye.id) siralamacik = index + 1
          if(veri._id != uye.id) geçildic += 1
        })
         let embed = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setThumbnail(uye.user.avatarURL({extension: 'png', size: 2048})).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının yetki ve yükseltim bilgileri aşağıda belirtilmiştir.`)
        .addFields(

{ name: `Yetkili Bilgisi`, value: `
\`Rol                       :\` ${Number(bulundugurol) + 1}. ROL
\`Sıralama                  :\` #${siralamacik} (Durum: ${siralamacik}/${geçildic})
\`Rolde Kalma Süresi        :\` ${client.sureCevir(Date.now() - puanBilgisi.Rolde)}
\`Yetkide Kalma Süresi      :\` ${client.sureCevir(Date.now() - puanBilgisi.Baslama)}
\`Yetki Başlama Tarihi      :\` <t:${String(Date.parse(puanBilgisi.Baslama)).slice(0, 10)}:F> 
\`Son Ses / Mesaj Aktifliği :\` ${sonSes} / ${sonMesaj}
\`Toplantı Katılım          :\` ${genelKatilim ? genelKatilim.length : 0} Katılım 
\`Bireysel Katılım          :\` ${bireyselKatilim ? bireyselKatilim.length : 0} Katılım
\`Liderlik / Sorumluluk     :\` ${genelsorumluluklar.length} adet (${genelsorumluluklar.join(", ")})
\`Durum                     :\` ${durumbelirt}

`},
{ name: `Puan Durumu`, value: `Puanınız: \`${puanBilgisi.Point.toFixed(1)}\` Bonus: \`+${puanBilgisi ? puanBilgisi.Bonus : 0}\` Gereken Puan: \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\`\n${puanBari}`},
{ name: `Yetki Durumu`, value: yetkidurumu }
        )
        
        let puandetay = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setThumbnail(uye.user.avatarURL({extension: 'png', size: 2048})).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının şuan ki yetkisinde kazandığı puan bilgileri aşağıda belirtilmiştir.`)
        .addFields({ name: `Puan Detayları`, value: `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Kayıtlar: \`${teyitoku ? teyitoku.Records ? teyitoku.Records.length : 0 : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Register : 0})\`
${ayarlar.type ? `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Taglılar: \`${taglıÇek} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Tag : 0})\`\n` : ``}${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Davetler: \`${davetbilgisi ? davetbilgisi.total ? davetbilgisi.total : 0 : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Invite : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Etkinlik: \`${puanBilgisi ? puanBilgisi.Etkinlik.toFixed(2) : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Etkinlik.toFixed(2) : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplantı: \`${puanBilgisi ? puanBilgisi.Toplantı.toFixed(2) : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Toplantı.toFixed(2) : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Ceza-i Durum: \`${cezapuanoku} (Ceza Etkisi: -${cezapuanoku > 5 ? cezapuanoku/2 : cezapuanoku})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Yetkili Ceza Notu: \`${yetkilicezanotu} (Ceza Etkisi: -${cezapuanoku > 50 ? yetkilicezanotu/10/0.5 : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bonus: \`${puanBilgisi ? puanBilgisi.Bonus : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Bonus : 0})\``},
        {name: `Diğer Puan Detayları`, value: `${simdimesaj}
${simdises}`},
        {name: `Puan Durumu`, value: `Puanınız: \`${puanBilgisi.Point.toFixed(1)}\` Gereken Puan: \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\`\n${puanBari}`},)

        let genelpuandurumu = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setThumbnail(uye.user.avatarURL({extension: 'png', size: 2048})).setDescription(`${uye} (${uye.roles.highest}) kullanıcısı <t:${Number(String(Date.parse(puanBilgisi.Baslama)).substring(0, 10))}:F> tarihinde yetkili olmuş, kazandığı toplam puanlar ve detayları aşağıda belirtilmiştir.`).addFields(
            { name: `Genel Puan Durumu`, value: `Toplam Puanınız: \`${puanBilgisi.ToplamPuan.toFixed(1)}\` Toplam Kalan Puan: \`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\`\n${genelpuanBari}`},
            { name: `Genel Puan Detayları`, value: `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Kayıt: \`${teyitbilgi}\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Davet: \`+${davetbilgisi ? davetbilgisi.total ? davetbilgisi.total : 0 : 0*_statSystem.points.invite} Puan\`
${ayarlar.type ? `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Taglı: \`+${taglıÇek*_statSystem.points.tagged} Puan\`\n` : ``}${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Ceza-i Durum: \`${cezapuanoku} (Ceza Etkisi: -${cezapuanoku > 5 ? cezapuanoku/2 : cezapuanoku})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Yetkili Ceza Notu: \`${yetkilicezanotu} (Ceza Etkisi: -${cezapuanoku > 50 ? yetkilicezanotu/10/0.5 : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Bonus: \`+${puanBilgisi ? puanBilgisi.ToplamBonus : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Etkinlik: \`+${puanBilgisi ? puanBilgisi.ToplamEtkinlik.toFixed(2) : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Toplantı: \`+${puanBilgisi ? puanBilgisi.ToplamToplantı.toFixed(2) : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Ses: \`+${puanBilgisi ? puanBilgisi.ToplamSes.toFixed(1) : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Mesaj: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``},
{ name: `Genel Ses Sıralaması`, value: `${siralases ? siralases : `${message.guild.emojiGöster(emojiler.Iptal)} Maalesef genel ses puan detayları bulunamadığından listelenemedi.`}`},
{ name: `Yetki Durumu`, value: `Şu an <@&${eskiRol.rol}> rolünden, son ${message.guild.roles.cache.get(_statSystem.endstaff) ? message.guild.roles.cache.get(_statSystem.endstaff) : "@Rol Bulunamadı."} rolüne ulaşabilmek için **\`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\`** puan kazanmanız gerekiyor.`}
      )

 
     let buttonGroup = [
        {label: "Yetki & Yükseltim Bilgisi", description: "Yetki ve yükseltim bilginizin anlık detaylarını göstermektedir.", emoji: {id: "949923925419253780"}, value: "buttonana"},
        {label: "Yükseltim Detayları", description: "Yükseltim bilginizin tüm detaylarını göstermektedir.", emoji: {id: "739689170250891305"}, value: "buttondetay"}, 
        {label: "Genel Yükseltim Bilgisi", description: "Yetkili olduğunuz boyunca tüm yükseltim bilgilerinizi göstermektedir.", emoji: {id: "947548337698115634"}, value: "buttongenel"}
    ]

     if(roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) || message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      buttonGroup.push([
        {label: "Yükseltim Paneli", description: `${uye.user.username} üyesinin yetki(yükselt/düşür) kontrolünü sağlar.`, emoji: {id: "621847216868425748"}, value: "buttonpanel"},
        {label: "Paneli Kapat", description: "Yükseltim panelini kapatır.", emoji: {id: "947548354756370472"}, value: "buttoniptal"}, 
      ])
    } else {
      buttonGroup.push([
        {label: "Paneli Kapat", description: "Yükseltim panelini kapatır.", emoji: {id: "947548354756370472"}, value: "buttoniptal"}, 
      ])
    }

     let Rowcuk = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("rowcukYetkili")
      .setPlaceholder(`${uye.user.username}'n detaylarını görüntüle`)
      .setOptions([
        buttonGroup
      ])
    )
     let görevBul = await Tasks.findOne({ roleID: eskiRol ? eskiRol.rol : "1231131"  }) || await Tasks.findOne({ roleID: uye.roles.hoist ? uye.roles.hoist.id : "1231131" }) || await Tasks.findOne({ roleID: uye.roles.highest ? uye.roles.highest.id : "1231131" })
    let yönetimPaneli;
    let siralaman = 0
    let geçildi = 1
    siralamabul.filter(x => message.guild.members.cache.has(x._id)).sort((a, b) => b.Görev - a.Görev).forEach((veri, index) => {
      if(veri._id == uye.id) siralaman = index + 1
      if(veri._id != uye.id) geçildi += 1
    })
    let public = 0;
    let register = 0;
    let genelses = 0;
    
    if(görevBul) {

      if(data.taskVoiceStats) {
        data.taskVoiceStats.forEach((value, key) => {
            genelses += value
            if(key == kanallar.publicKategorisi) public += Number(client.cartelSaatYap(value))
            if(key == kanallar.streamerKategorisi) public += Number(client.cartelSaatYap(value))
            if(key == kanallar.registerKategorisi) register += Number(client.cartelSaatYap(value))
        });
      };
      let gorevdurum = Number((puanBilgisi.Mission.completedMission / görevBul.countTasks) * 100)
      let durumcuuukk = ``
      if(gorevdurum < 45) durumcuuukk = `Devam etmelisin (Kalan: %${Number(100 - gorevdurum).toFixed(1)})`
      if(gorevdurum > 45) durumcuuukk = `Az daha çabala (Kalan: %${Number(100 - gorevdurum).toFixed(1)})`
      if(gorevdurum >= 75) durumcuuukk = `Geçerli durumdasın ama daha fazla gayret (Kalan: %${Number(100 - gorevdurum).toFixed(1)})`
      if(gorevdurum == 100) durumcuuukk = `Tebrikler! Tüm görevleri tamamladın.`
      if(görevBul.Time && görevBul.Time > 0 && Date.now() >= görevBul.Time) {
      
        yönetimPaneli = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})})
        .setDescription(`${uye} (${görevBul.roleID ? message.guild.roles.cache.get(görevBul.roleID) : "@Rol Bulunamadı."}) ${görevBul.Completed.includes(uye.id) ? `üyesinin rolüne ait görev tamamlama zamanı dolmuş ve tamamlamış diğer bilgiler ise aşağıda belirtilmiştir.` : `üyesinin rolüne ait görev tamamlama zamanı dolmuş fakat tamamlayamamış diğer bilgiler ise aşağıda belirtilmiştir.`}`)
        .addFields({name: `Yetkili Bilgisi`, value: `\`Rol                       :\` ${Number(bulundugurol) + 1}. ROL
\`Sıralama                  :\` #${siralaman} (Durum: ${siralaman}/${geçildi})
\`Rolde Kalma Süresi        :\` ${client.sureCevir(Date.now() - puanBilgisi.Rolde)}
\`Yetkide Kalma Süresi      :\` ${client.sureCevir(Date.now() - puanBilgisi.Baslama)}
\`Yetki Başlama Tarihi      :\` <t:${String(Date.parse(puanBilgisi.Baslama)).slice(0, 10)}:F>
\`Son Ses / Mesaj Aktifliği :\` ${sonSes} / ${sonMesaj}
\`Yetkili Ceza Notu / Puan  :\` ${yetkilicezanotu} / ${cezapuanoku} Puan
\`Toplantı Katılım          :\` ${genelKatilim ? genelKatilim.length : 0} Katılım 
\`Bireysel Katılım          :\` ${bireyselKatilim ? bireyselKatilim.length : 0} Katılım
\`Liderlik / Sorumluluk     :\` ${genelsorumluluklar.length} adet (${genelsorumluluklar.join(", ")})
\`Toplam Görev Puanı        :\` ${puanBilgisi.Görev ? puanBilgisi.Görev : 0}
\`Görev Tarihi              :\` <t:${String(görevBul.Date).slice(0, 10)}:F>
\`Ödül(ler)                 :\` ${görevBul.Reward} Görev Puanı ve ${ayarlar.serverName} Parası
\`Tamamlanan Görev Sayısı   :\` ${puanBilgisi.Mission.completedMission} adet (Kalan: ${görevBul.countTasks-puanBilgisi.Mission.completedMission})
${görevBul.Time ? `\`Görev Bitiş Zamanı        :\`  Bitti!\n` : ``}\`Durum                     :\` ${durumcuuukk}`})
        
      } else {
      yönetimPaneli = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setThumbnail(uye.user.avatarURL({extension: 'png', size: 2048}))
    .setDescription(`${uye}, (${görevBul.roleID ? message.guild.roles.cache.get(görevBul.roleID) : "@Rol Bulunamadı."}) üyesinin yetkili bilgisi aşağıda detaylı bir şekilde belirtilmiştir. Bulunan düğmeler ile aktif görevinin bilgisini görüntüleyebilirsin.`)
    .addFields({ name: `Yetkili Bilgisi`, value: `\`Rol                       :\` ${Number(bulundugurol) + 1}. ROL
\`Sıralama                  :\` #${siralaman} (Durum: ${siralaman}/${geçildi})
\`Rolde Kalma Süresi        :\` ${client.sureCevir(Date.now() - puanBilgisi.Rolde)}
\`Yetkide Kalma Süresi      :\` ${client.sureCevir(Date.now() - puanBilgisi.Baslama)}
\`Yetki Başlama Tarihi      :\` <t:${String(Date.parse(puanBilgisi.Baslama)).slice(0, 10)}:F>
\`Son Ses / Mesaj Aktifliği :\` ${sonSes} / ${sonMesaj}
\`Yetkili Ceza Notu / Puan  :\` ${yetkilicezanotu} / ${cezapuanoku} Puan
\`Toplantı Katılım          :\` ${genelKatilim ? genelKatilim.length : 0} Katılım 
\`Bireysel Katılım          :\` ${bireyselKatilim ? bireyselKatilim.length : 0} Katılım
\`Liderlik / Sorumluluk     :\` ${genelsorumluluklar.length} adet (${genelsorumluluklar.join(", ")})
\`Toplam Görev Puanı        :\` ${puanBilgisi.Görev ? puanBilgisi.Görev : 0}
\`Görev Tarihi              :\` <t:${String(görevBul.Date).slice(0, 10)}:F>
\`Ödül(ler)                 :\` ${görevBul.Reward} Görev Puanı ve ${ayarlar.serverName} Parası
\`Tamamlanan Görev Sayısı   :\` ${puanBilgisi.Mission.completedMission} adet (Kalan: ${görevBul.countTasks-puanBilgisi.Mission.completedMission})
${görevBul.Time ? `\`Görev Bitiş Zamanı        :\` <t:${String(görevBul.Time).slice(0, 10)}:R>\n` : ``}\`Durum                     :\` ${durumcuuukk}`})
  }
      } else {
        yönetimPaneli = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setThumbnail(uye.user.avatarURL({extension: 'png', size: 2048}))
        
        .addFields(

          { name: `Yetkili Bilgisi`, value: `
\`Rol                       :\` ${Number(bulundugurol) + 1}. ROL
\`Sıralama                  :\` #${siralaman} (Durum: ${siralaman}/${geçildi})
\`Rolde Kalma Süresi        :\` ${client.sureCevir(Date.now() - puanBilgisi.Rolde)}
\`Yetkide Kalma Süresi      :\` ${client.sureCevir(Date.now() - puanBilgisi.Baslama)}
\`Yetki Başlama Tarihi      :\` <t:${String(Date.parse(puanBilgisi.Baslama)).slice(0, 10)}:F>
\`Son Ses / Mesaj Aktifliği :\` ${sonSes} / ${sonMesaj}
\`Yetkili Ceza Notu / Puan  :\` ${yetkilicezanotu} / ${cezapuanoku} Puan
\`Toplantı Katılım          :\` ${genelKatilim ? genelKatilim.length : 0} Katılım 
\`Bireysel Katılım          :\` ${bireyselKatilim ? bireyselKatilim.length : 0} Katılım
\`Liderlik / Sorumluluk     :\` ${genelsorumluluklar.length} adet (${genelsorumluluklar.join(", ")})
\`Toplam Görev Puanı        :\` ${puanBilgisi.Görev ? puanBilgisi.Görev : 0}
\`Durum                     :\` Şuan da aktif görev bulunamadı.
          
          `})
        .setDescription(`${uye} (${eskiRol ? message.guild.roles.cache.get(eskiRol.rol) : uye.roles.highest}) üyesinin aşağıda yetki ve görev bilgileri belirtilmektedir.`)
      }
    let compo = []
    if(görevBul && görevBul.Time && görevBul.Time > 0 && Date.now() >= görevBul.Time) {
      if(görevBul.Completed.includes(uye.id)) {
        if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki) yönetimPaneli.addFields({name: `**Yükseltim Durumu**`, value: `Bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için gereken tüm görevleri tamamladı. Yükseltim yapmak için aşağıda bulunan "Yükselt" düğkmesini kullanabilirsin.`})
        compo = [
          new ButtonBuilder()
          .setCustomId("yükselt")
          .setLabel("Yükselt")
          .setEmoji("949923925419253780")
          .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
          .setCustomId("yetki_bilgisi")
          .setDisabled(true)
          .setLabel("Yetki Bilgisi")
          .setEmoji("1059063606022504448")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("gorev_bilgisi")
          .setLabel("Görev Bilgisi")
          .setEmoji("1059071696428093470")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("yukseltimPaneli")
          .setLabel("Yükseltim Paneli")
          .setEmoji("621847216868425748")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("kapatcik")
          .setLabel("Paneli Kapat")
          .setEmoji("947548354756370472")
          .setStyle(ButtonStyle.Secondary)
        ]
      } else {
        if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki) yönetimPaneli.addFields({name: `**Yükseltim Durumu**`, value: `Bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için gereken tüm görevleri tamamlamadı. Düşüm yapmak için aşağıda bulunan "Düşür" düğmesini kullanabilirsin.`})
        compo = [
          new ButtonBuilder()
          .setCustomId("düşür")
          .setLabel("Düşür")
          .setEmoji("985381700991332462")
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId("yetki_bilgisi")
          .setLabel("Yetki Bilgisi")
          .setDisabled(true)
          .setEmoji("1059063606022504448")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("gorev_bilgisi")
          .setLabel("Görev Bilgisi")
          .setEmoji("1059071696428093470")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("yukseltimPaneli")
          .setLabel("Yükseltim Paneli")
          .setEmoji("621847216868425748")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId("kapatcik")
          .setLabel("Paneli Kapat")
          .setEmoji("947548354756370472")
          .setStyle(ButtonStyle.Secondary)
        ]
      }
    } if(görevBul) {
      if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki) yönetimPaneli.addFields({name: `**Yükseltim Durumu**`, value: `Şu an <@&${eskiRol.rol}> rolündesiniz. Bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için tüm görevleri tamamlamalısınız.`})
      compo = [
        new ButtonBuilder()
        .setCustomId("yetki_bilgisi")
        .setLabel("Yetki Bilgisi")
        .setEmoji("1059063606022504448")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("gorev_bilgisi")
        .setLabel("Görev Bilgisi")
        .setEmoji("1059063657826373652")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("yukseltimPaneli")
        .setLabel("Yükseltim Paneli")
        .setEmoji("621847216868425748")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("kapatcik")
        .setLabel("Paneli Kapat")
        .setEmoji("947548354756370472")
        .setStyle(ButtonStyle.Secondary)
      ]
    } 
    else {
      if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki) yönetimPaneli.addFields({name: `**Yükseltim Durumu**`, value: `Şu an <@&${eskiRol.rol}> rolündesiniz. Bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için tüm görevleri tamamlamalısınız.`})
      compo = [
        new ButtonBuilder()
        .setCustomId("yukseltimPaneli")
        .setLabel("Yükseltim Paneli")
        .setEmoji("621847216868425748")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("kapatcik")
        .setLabel("Paneli Kapat")
        .setEmoji("947548354756370472")
        .setStyle(ButtonStyle.Secondary)
      ]
    }

    let RowGorev = new ActionRowBuilder().addComponents(
      compo
    )
    let RowCukiki = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId("yetki_bilgisi")
      .setDisabled(true)
      .setLabel("Yetki Bilgisi")
      .setEmoji("1059063606022504448")
      .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
      .setCustomId("gorev_bilgisi")
      .setLabel("Görev Bilgisi")
      .setEmoji("1059071696428093470")
      .setStyle(ButtonStyle.Secondary),
    )
    if(puanBilgisi && (görevBul || puanBilgisi.Yönetim)) return await message.reply({embeds: [yönetimPaneli], components: roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) || message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) ? [RowGorev] : [RowCukiki]}).then(async (manmsg) => {
      var filter = (button) => button.user.id === message.member.id
      let collector = await manmsg.createMessageComponentCollector({filter, time: 60000 })
      collector.on("collect", async (button) => {
        if(button.customId === "gorev_bilgisi") {
          let embedcik = new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`Aşağı da ${görevBul.roleID ? message.guild.roles.cache.get(görevBul.roleID) : "@Rol Bulunamadı."} rolüne ait yapılması gereken görevler belirtilmiştir. Görev süreniz boyunca en az **%75**'lik kısmını tamamlamanız gerekmektedir.`)
          if(görevBul.publicVoice >= 1) {
            if(!roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) embedcik.addFields({ name: `${görevBul.publicVoice} Saat Public/Streamer Kanalında Takıl!`, value: `${public >= görevBul.publicVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${yönetimBar(public ? public : 0, görevBul.publicVoice, 5, public)} \`${public >= görevBul.publicVoice ? `Tamamlandı!`: `${public} saat / ${görevBul.publicVoice} saat`}\``})
            if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) embedcik.addFields({ name: `${görevBul.publicVoice} Saat Register Kanallarında Takıl!`, value: `${register >= görevBul.publicVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${yönetimBar(register ? register : 0, görevBul.publicVoice, 5, register)} \`${register >= görevBul.publicVoice ? `Tamamlandı!`: `${register} saat / ${görevBul.publicVoice} saat`}\``})
           }
           if(görevBul.AllVoice >= 1) {
             embedcik.addFields({ name: `${görevBul.AllVoice} Saat Tüm Ses Kanallarında Takıl!`, value: `${Number(client.cartelSaatYap(genelses)) >= görevBul.AllVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Mesaj) } ${yönetimBar(Number(client.cartelSaatYap(genelses)) ? Number(client.cartelSaatYap(genelses)) : 0, görevBul.AllVoice, 5, Number(client.cartelSaatYap(genelses)))} \`${Number(client.cartelSaatYap(genelses)) >= görevBul.AllVoice ? `Tamamlandı!`: `${Number(client.cartelSaatYap(genelses))} saat / ${görevBul.AllVoice} saat`}\``})
           }
           if(görevBul.Register >= 1) embedcik.addFields({ name: `${görevBul.Register} Kişiyi Kayıt Et!`, value: `${puanBilgisi.Mission.Register >= görevBul.Register ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${yönetimBar(puanBilgisi.Mission.Register ? puanBilgisi.Mission.Register : 0, görevBul.Register, 5, puanBilgisi.Mission.Register)} \`${puanBilgisi.Mission.Register >= görevBul.Register ? `Tamamlandı!`: `${puanBilgisi.Mission.Register} / ${görevBul.Register}`}\`` })
          if(görevBul.Invite >= 1) embedcik.addFields({ name: `${görevBul.Invite} Kişiyi Davet Et!`, value: `${puanBilgisi.Mission.Invite >= görevBul.Invite ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${yönetimBar(puanBilgisi.Mission.Invite ? puanBilgisi.Mission.Invite : 0, görevBul.Invite, 5, puanBilgisi.Mission.Invite)} \`${puanBilgisi.Mission.Invite >= görevBul.Invite ? `Tamamlandı!`: `${puanBilgisi.Mission.Invite} / ${görevBul.Invite}`}\`` })
          if(görevBul.Tagged >= 1) embedcik.addFields({ name: `${görevBul.Tagged} Kişiyi Taga Davet Et!`, value: `${puanBilgisi.Mission.Tagged >= görevBul.Tagged ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Taglı) } ${yönetimBar(puanBilgisi.Mission.Tagged ? puanBilgisi.Mission.Tagged : 0, görevBul.Tagged, 5, puanBilgisi.Mission.Tagged)} \`${puanBilgisi.Mission.Tagged >= görevBul.Tagged ? `Tamamlandı!`: `${puanBilgisi.Mission.Tagged} / ${görevBul.Tagged}`}\`` }) 
          if(görevBul.Staff >= 1) embedcik.addFields({ name: `${görevBul.Staff} Kişiyi Yetkiye Davet Et!`, value: `${puanBilgisi.Mission.Staff >= görevBul.Staff ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Yetkili) } ${yönetimBar(puanBilgisi.Mission.Staff ? puanBilgisi.Mission.Staff : 0, görevBul.Staff, 5, puanBilgisi.Mission.Staff)} \`${puanBilgisi.Mission.Staff >= görevBul.Staff ? `Tamamlandı!`: `${puanBilgisi.Mission.Staff} / ${görevBul.Staff}`}\`` })
          if(görevBul.Sorumluluk >= 1) embedcik.addFields({ name: `Liderlik/Sorumluluk İçin ${görevBul.Sorumluluk} Puan Kazan!`, value: `${puanBilgisi.Mission.Sorumluluk >= görevBul.Sorumluluk ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster("cartel_resp") } ${yönetimBar(puanBilgisi.Mission.Sorumluluk ? puanBilgisi.Mission.Sorumluluk : 0, görevBul.Sorumluluk, 5, puanBilgisi.Mission.Sorumluluk)} \`${puanBilgisi.Mission.Sorumluluk >= görevBul.Sorumluluk ? `Tamamlandı!`: `${puanBilgisi.Mission.Sorumluluk ? Number(puanBilgisi.Mission.Sorumluluk).toFixed(2) : 0} / ${görevBul.Sorumluluk}`}\`\nBu görevi tamamlamak zorunludur.` })
          if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki) embedcik.addFields({name: `**Yükseltim Durumu**`, value: `Şu an <@&${eskiRol.rol}> rolündesiniz. Bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için tüm görevleri tamamlamalısınız.`})
          if(!roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && uye.roles.cache.has(_statSystem.endstaff)) embedcik.addFields({name: `**Yönetim Durumu**`, value: `Şu an son yönetim yetkisindesiniz! Emekleriniz için teşekkür ederiz.`})
          if(görevBul && görevBul.Time && görevBul.Time > 0 && Date.now() >= görevBul.Time) {
            RowCukiki.components[0].setDisabled(false);
            RowCukiki.components[1].setDisabled(true);
            RowGorev.components[1].setDisabled(false);
            RowGorev.components[2].setDisabled(true);
          } else {
            RowCukiki.components[0].setDisabled(false);
            RowCukiki.components[1].setDisabled(true);
            RowGorev.components[0].setDisabled(false);
            RowGorev.components[1].setDisabled(true);
          }
          manmsg.edit({embeds: [embedcik], components: [ roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) || message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) ? RowGorev : RowCukiki]})
          await button.deferUpdate()
          
        }
        if(button.customId === "yetki_bilgisi") {
          if(görevBul && görevBul.Time && görevBul.Time > 0 && Date.now() >= görevBul.Time) {
            RowCukiki.components[0].setDisabled(true);
            RowCukiki.components[1].setDisabled(false);
            RowGorev.components[1].setDisabled(true);
            RowGorev.components[2].setDisabled(false);
          } else {
            RowCukiki.components[0].setDisabled(true);
            RowCukiki.components[1].setDisabled(false);
            RowGorev.components[0].setDisabled(true);
            RowGorev.components[1].setDisabled(false);
          }
        manmsg.edit({embeds: [yönetimPaneli], components: [ roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) || message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) ? RowGorev : RowCukiki]})
          await button.deferUpdate()
        }
        if(button.customId === "yukseltimPaneli") {
          manmsg.delete().catch(err => {})
          let kom = client.commands.find(x => x.Isim == "yetki")
          kom.onRequest(client, message, args)
          await button.deferUpdate()
        }
        if(button.customId === "yükselt") {
          manmsg.delete().catch(err => {})
          let kom = client.commands.find(x => x.Isim == "yükselt")
          kom.onRequest(client, message, args)
          await button.deferUpdate()
        }
        if(button.customId === "düşür") {
          manmsg.delete().catch(err => {})
          let kom = client.commands.find(x => x.Isim == "düşür")
          kom.onRequest(client, message, args)
          await button.deferUpdate()
        }
        if(button.customId === "kapatcik") {
          manmsg.delete().catch(err => {})
        }
      });

      collector.on("end", async () => {
        manmsg.delete().catch(x => {})
      });
    })
    let msg = await message.reply({ embeds: [embed],  components: [Rowcuk] })
      var filter = (button) => button.user.id === message.member.id && button.customId == "rowcukYetkili";
      let collector = await msg.createMessageComponentCollector({filter, time: 60000 })

      collector.on("collect", async (button) => {
        if(button.values[0] === "buttonana") {
          msg.edit({embeds: [embed]})
            await button.deferUpdate()
        }
        if(button.values[0] === "buttondetay") {
          msg.edit({embeds: [puandetay]})
          await button.deferUpdate()
        }
        if(button.values[0] === "buttongenel") {
            msg.edit({embeds: [genelpuandurumu]})
            await button.deferUpdate()
        }
        if(button.values[0] === "buttonpanel") {
          msg.delete().catch(err => {})
          let kom = client.commands.find(x => x.Isim == "yetki")
          kom.onRequest(client, message, args)
          await button.deferUpdate()
      }
        if(button.values[0] === "buttoniptal") {
          msg.delete().catch(err => {})
        }
      });

      collector.on("end", async () => {
        msg.delete().catch(x => {})
      });

        function progressBar(value, maxValue, size, veri, renk = ayarlar.renkliBar ? barSystem.filter(x => x.id != "diger").shuffle()[0] : barSystem[6]) {
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri == 0) progressStart = `${message.guild.emojiGöster(renk.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojiGöster(renk.başlamaBar ? renk.başlamaBar : renk.başlamaBa)}`
            const progressText = `${message.guild.emojiGöster(renk.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojiGöster(renk.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojiGöster(renk.doluBitişBar)}` : `${message.guild.emojiGöster(renk.boşBitişBar)}`}`;
            return bar;
        };

        function yönetimBar(value, maxValue, size, veri, renk = ayarlar.renkliBar ? barSystem.filter(x => x.id != "diger").shuffle()[0] : barSystem[6]) {
          
            if(veri < 0) value = 0
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri <= 0) progressStart = `${message.guild.emojiGöster(renk.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojiGöster(renk.başlamaBar ? renk.başlamaBar : renk.başlamaBar)}`
            const progressText = `${message.guild.emojiGöster(renk.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojiGöster(renk.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojiGöster(renk.doluBitişBar)}` : `${message.guild.emojiGöster(renk.boşBitişBar)}`}`;
            return bar;
        };
   });
  }
};

