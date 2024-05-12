const { Client, Message } = require("discord.js");
const util = require("util")
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
module.exports = {
  Isim: "detaydenetim",
  Komut: ["textdenetim","yazıdenetim"],
  Kullanim: "detaydenetim <@rol/ID>",
  Aciklama: "Belirlenen role sahip üyelerin tüm ses ve mesaj detaylarını gösterir.",
  Kategori: "stat",
  Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (duration) => {  
      let arr = []
      if (duration / 3600000 > 1) {
        let val = parseInt(duration / 3600000)
        let durationn = parseInt((duration - (val * 3600000)) / 60000)
        arr.push(`${val} saat`)
        arr.push(`${durationn} dk.`)
      } else {
        let durationn = parseInt(duration / 60000)
        arr.push(`${durationn} dk.`)
      }
      return arr.join(", ") };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))&& !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(rol.members.size <= 0) return message.reply({content: `Belirtilen ${rol.name} isimli rolde üye bulunamadığından işlem iptal edildi. ${cevaplar.prefix}`})
    let Data = await Stats.find({guildID: message.guild.id})
    if(!Data) return message.reply({content: `Bu sunucuya ait herhangi bir istatistik verisine ulaşılamadı.`});
    let genelChatKanalı = message.guild.channels.cache.get(ayarlar.chatKanalı)
    Data = Data.filter(data => {
      let uye = message.guild.members.cache.get(data.userID)
      return uye && uye.roles.cache.has(rol.id)
    });


    let veriler = []
    let vericikler = []

    Data.sort((a, b) => {
      let kul1 = Number(a.totalVoiceStats);
      let kul2 = Number(b.totalVoiceStats);

      return kul2 - kul1
    }).map((data, index) => {
    let uye = message.guild.members.cache.get(data.userID);

    let _stat = {
      kullanıcı: uye,
      genelToplam: data.lifeTotalVoiceStats || 0,
      haftalıktoplam: data.totalVoiceStats || 0,
      toplamchat: 0,
      genelchat: 0,
      haftalikListe: []
    }

    if(data.voiceStats) data.voiceStats.forEach((value, key) => { 
      if(_statSystem.voiceCategorys.find(x => x.id == key)) {
        let kategori = _statSystem.voiceCategorys.find(x => x.id == key);
        let kategoriismi = kategori.isim 
        if(_statSystem.fullPointChannels.some(x => x == key)) {
          _stat.haftalikListe.push(`\` • \` **${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}** : \`${client.sureCevir(value)}\``)
        } else {
          _stat.haftalikListe.push(`\` • \` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\``)
        }
      }
    })
    if(data.chatStats) {
      data.chatStats.forEach(c => _stat.toplamchat += c);
      data.chatStats.forEach((value, key) => { if(key == _statSystem.generalChatCategory) _stat.genelchat = value });
    }

    if(data.voiceStats) {
      if(data.totalVoiceStats > 0 || _stat.genelchat > 10) {
        veriler.push(data.userID)
        vericikler.push(_stat)
      }
    } else {

    }

    })
    
    let verisizler = rol.members.filter(x => !veriler.includes(x.id))

    let text = `Aşağı da **${rol.name}** rolündeki üyelerin, haftalık ses ve mesaj verileri sıralandırılmıştır. Sıralandırma şekli haftalık en iyi olarak şeklinde sıralandırılmıştır.  
${vericikler.sort((a, b) => b.haftalıktoplam - a.haftalıktoplam).map((x, index) => `──────────────────────
${index == 0 ? `👑` : `**${index+1}.**`} ${x.kullanıcı.toString()} Üyesinin ses ve genel chat istatistik bilgileri aşağıda detaylı bir şekilde sıralandırılmıştır,
Tüm zaman boyunca \`${client.sureCevir(x.genelToplam)}\` seste kalmış.
Tüm zaman boyunca toplam da \`${x.toplamchat}\` mesaj atmış.
Bu hafta boyunca \`${client.sureCevir(x.haftalıktoplam)}\` seste kalmış.
Bu hafta boyunca toplam da ${genelChatKanalı ? genelChatKanalı : `#deleted-channel`} kanalına \`${x.genelchat}\` mesaj atmış.
${x.haftalikListe.length > 0 ? `Bu hafta vakit geçirdiği kanal(lar) şunlardır:
${x.haftalikListe.join("\n")}` : `Bu hafta kategorilendirilmiş ses kanallarında bulunamamış.`}`).join("\n")}
${verisizler.size > 0 ? `──────────────────────
**${rol.name}** rolünde bulunan **${verisizler.size}** üyenin verisi bulunamadı veya gereğinden çok yetersiz. Bu üyeler şunlardır:
${verisizler.map(x => x).join(", ")}
──────────────────────` : ``}`
    message.reply({content: `${text}`}).catch(err => {
      const arr = splitMessages(`${text}`, { maxLength: 1950, char: "\n" });
      arr.forEach(element => {
         message.channel.send({content: `${element}`});
      });
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
};