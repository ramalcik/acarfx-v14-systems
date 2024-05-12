const {Collection} = require('discord.js');
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const { genEmbed } = require('../../../../Global/Init/Embed');
const moment = require('moment')
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Invite = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Discord = require("discord.js")

/**
 * @param { Client } ready
 */

module.exports = async () => {
  let guild = client.guilds.cache.get(sistem.SERVER.ID)
  if(!guild) return;
  let sıralamaKanalı = client.channels.cache.get(kanallar.sıralamaKanalı)
  if(!sıralamaKanalı) return;

  let LeaderBoard;
  let LeaderBoardiki;
  
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  const data = Database.Caches

  if(data && data.leaderboardVoice && data.leaderboardText) {
    try {
      LeaderBoard = await sıralamaKanalı.messages.fetch(data.leaderboardVoice)
    } catch (err) {
      LeaderBoard = await sıralamaKanalı.send(`Yeni bir ses sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardVoice`]: LeaderBoard.id}}, {upsert: true})
    }
  
    try {
      LeaderBoardiki = await sıralamaKanalı.messages.fetch(data.leaderboardText)
    } catch (err) {
      LeaderBoardiki = await sıralamaKanalı.send(`Yeni bir metin sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardText`]: LeaderBoardiki.id}}, {upsert: true})
    }

  } else {
    LeaderBoard = await sıralamaKanalı.send(`Yeni bir ses sıralama mesajı oluşturuluyor...`)
    LeaderBoardiki = await sıralamaKanalı.send(`Yeni bir metin sıralama mesajı oluşturuluyor...`)

    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardVoice": LeaderBoard.id,
      "Caches.leaderboardText": LeaderBoardiki.id
    }}, {upsert: true})
  }

  if(ayarlar && ayarlar.sıralamaKanalı) checkingLeader()
  setInterval(() => {
    if(ayarlar && ayarlar.sıralamaKanalı) checkingLeader()
  }, 600000 * 6);

  async  function checkingLeader() { 
    let onecik = [] 
    onecik = []
    const data = await Stats.find({guildID: sistem.SERVER.ID})
    const sureCevir = (duration) => {  
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
    const voiceUsers = data.sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        if(uye2.voiceStats) uye2.voiceStats.forEach(x => uye2Toplam2 += x);
        let uye1Toplam2 = 0;
        if(uye1.voiceStats) uye1.voiceStats.forEach(x => uye1Toplam2 += x);
        return uye2Toplam2-uye1Toplam2;
    }).slice(0, 30).map((m, index) => {
        let uyeToplam2 = 0;
        if(m.voiceStats) m.voiceStats.forEach(x => uyeToplam2 += x);
        let sunucu = client.guilds.cache.get(sistem.SERVER.ID);
        let uyecik = sunucu.members.cache.get(m.userID)
        if(sunucu && uyecik && index == 0) onecik.push(uyecik.id);
        return `\` ${index + 1} \` <@${m.userID}>: \`${moment.duration(uyeToplam2).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika]')}\``;
    }).join('\n');
    let messageUsers = data.sort((uye1, uye2) => {
        let uye2Toplam = 0;
        if(uye2.voiceStats) uye2.chatStats.forEach(x => uye2Toplam += x);
        let uye1Toplam = 0;
        if(uye1.voiceStats) uye1.chatStats.forEach(x => uye1Toplam += x);
        return uye2Toplam-uye1Toplam;
    }).slice(0, 30).map((m, index) => {
        let uyeToplam = 0;
        if(m.voiceStats) m.chatStats.forEach(x => uyeToplam += x);
        let sunucu = client.guilds.cache.get(sistem.SERVER.ID);
        let uyecik = sunucu.members.cache.get(m.userID)
        if(sunucu && uyecik && index == 0) onecik.push(uyecik.id);
        return `\` ${index + 1} \` <@${m.userID}>: \`${Number(uyeToplam)} mesaj\``;
    }).join('\n');
    let sunucu = client.guilds.cache.get(sistem.SERVER.ID);

    if(ayarlar && ayarlar.haftaBirincileri && ayarlar.haftaninBirinciRolü && onecik && onecik.length > 0) {
 
      let eklenecek = sunucu.members.cache.filter(x => !roller.kayıtsızRolleri.some(rol => x.roles.cache.has(rol)) && !x.roles.cache.has(roller.underworldRolü) && !x.roles.cache.has(roller.jailRolü) && !x.roles.cache.has(roller.şüpheliRolü) && !x.roles.cache.has(roller.yasakTagRolü) && !ayarlar.staff.includes(x.id) && !x.permissions.has(Discord.PermissionFlagsBits.Administrator) && !roller.kurucuRolleri.some(rol => x.roles.cache.has(rol)) && !roller.Yetkiler.some(rol => x.roles.cache.has(rol))  && !x.roles.cache.has(ayarlar.haftaninBirinciRolü) && onecik.includes(x.id))
      if(eklenecek) eklenecek.forEach(x => {
        x.roles.add(ayarlar.haftaninBirinciRolü).catch(err => {})
      })
      let uyeler = sunucu.members.cache.filter(x => x.roles.cache.has(ayarlar.haftaninBirinciRolü) && !onecik.includes(x.id))
      if(uyeler) {
        uyeler.forEach(uye => {
          uye.roles.remove(ayarlar.haftaninBirinciRolü).catch(err => {})
        })
      }
    } else if(ayarlar && ayarlar.haftaBirincileri && ayarlar.haftaninBirinciRolü && onecik && onecik.length <= 0) {
      let uyeler = sunucu.members.cache.filter(x => x.roles.cache.has(ayarlar.haftaninBirinciRolü))
      if(uyeler) {
        uyeler.forEach(uye => {
          uye.roles.remove(ayarlar.haftaninBirinciRolü).catch(err => {})
        })
      }
    }
    const voiceList = (`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`)
    const messageList = (`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`)
    let MessageEdit = new genEmbed()
    MessageEdit.setColor("Random")
    MessageEdit.setAuthor({ name: client.guilds.cache.get(sistem.SERVER.ID).name, iconURL: client.guilds.cache.get(sistem.SERVER.ID).iconURL({extension: 'png'})})
    LeaderBoard.edit({content: null,embeds: [MessageEdit.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : client.guilds.cache.get(sistem.SERVER.ID).name}** sunucusuna ait haftalık genel ses sıralaması listelenmektedir.\n\n${voiceList}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
    LeaderBoardiki.edit({content: null,embeds: [MessageEdit.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : client.guilds.cache.get(sistem.SERVER.ID).name}** sunucusuna ait haftalık genel mesaj sıralaması listelenmektedir.\n\n${messageList}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
    
  }
 
};

module.exports.config = {
    Event: "ready"
}


client.on('ready', async () => {
  let guild = client.guilds.cache.get(sistem.SERVER.ID)
  if(!guild) return;
  let Database = await GUILD_SETTINGS.findOne({_id: "1"})
  let Data = Database
  if(!Data) return;

  if(Data.Ayarlar && Data.Ayarlar.yayınSıralamaKanalı) yayınSıralaması(guild)
  if(Data.Ayarlar && Data.Ayarlar.davetSıralamaKanalı) davetSıralaması(guild)
  if(Data.Ayarlar && Data.Ayarlar.yetkiliSıralamaKanalı) yetkiliSıralaması(guild)
  if(Data.Ayarlar && Data.Ayarlar.taglıSıralamaKanalı) taglıSıralaması(guild)
  if(Data.Ayarlar && Data.Ayarlar.teyitSıralamaKanalı) teyitSıralaması(guild)

  setInterval(() => {
    if(Data.Ayarlar && Data.Ayarlar.yetkiliSıralamaKanalı) yetkiliSıralaması(guild)
    if(Data.Ayarlar && Data.Ayarlar.taglıSıralamaKanalı) taglıSıralaması(guild)
    if(Data.Ayarlar && Data.Ayarlar.teyitSıralamaKanalı) teyitSıralaması(guild)
  }, 600000 * 3)

  setInterval(() => {
    if(Data.Ayarlar && Data.Ayarlar.yayınSıralamaKanalı) yayınSıralaması(guild)
    if(Data.Ayarlar && Data.Ayarlar.davetSıralamaKanalı) davetSıralaması(guild)
  }, 600000 * 4)

})

async function yayınSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.yayınSıralamaKanalı)
  if(!kanal) return;
  let Data = await Users.find()
  Data = Data.filter(x => guild.members.cache.has(x._id) && x.Streaming).sort((a, b) => {
    let uye2Toplam2 = 0;
    b.Streaming.map(x => {
        uye2Toplam2 += Number(x.End - x.Start)
    })
    let uye1Toplam2 = 0;
    a.Streaming.map(x => {
        uye1Toplam2 += Number(x.End - x.Start)
    })
    return uye2Toplam2 - uye1Toplam2 
  }).map((result, index) => {
    let uyeToplam2 = 0;
    result.Streaming.map(x => {
       uyeToplam2 += Number(x.End - x.Start)
    })
    return `\` ${index + 1} \` <@${result._id}>: \`${moment.duration(uyeToplam2).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika]')}\``
  })
  if(data && data.leaderboardStream) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardStream)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir yayın açma sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardStream`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir yayın açma sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardStream": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait en iyi yayın açan sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}

async function davetSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.davetSıralamaKanalı)
  if(!kanal) return;
  let Data = await Invite.find()
  Data = Data.filter(x => guild.members.cache.has(x.userID) && x.total).sort((a, b) => {
    var aa = Number(a.total)
    var bb = Number(b.total)
    return bb - aa
  }).map((result, index) => {

    return `\` ${index + 1} \` <@${result.userID}>: \`${result.total} davet\``
  })
  if(data && data.leaderboardInvite) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardInvite)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir davet sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardInvite`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir davet sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardInvite": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait en iyi davet sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}

async function taglıSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.taglıSıralamaKanalı)
  if(!kanal) return;
  let Data = await Users.find()
  Data = Data.filter(x => guild.members.cache.has(x._id) && x.Taggeds).sort((a, b) => {
    var aa = Number(a.Taggeds.length)
    var bb = Number(b.Taggeds.length)
    return bb - aa
  }).map((result, index) => {

    return `\` ${index + 1} \` <@${result._id}>: \`${result.Taggeds.length} taglı\``
  })
  if(data && data.leaderboardTagged) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardTagged)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir taglı sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardTagged`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir taglı sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardTagged": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait en iyi taglı çeken sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}


async function yetkiliSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.yetkiliSıralamaKanalı)
  if(!kanal) return;
  let Data = await Users.find()
  Data = Data.filter(x => guild.members.cache.has(x._id) && x.Staffs).sort((a, b) => {
    var aa = Number(a.Staffs.length)
    var bb = Number(b.Staffs.length)
    return bb - aa
  }).map((result, index) => {

    return `\` ${index + 1} \` <@${result._id}>: \`${result.Staffs.length} yetkili\``
  })
  if(data && data.leaderboardStaff) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardStaff)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir yetkili sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardStaff`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir yetkili sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardStaff": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait en iyi yetkili çeken sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}


async function yetkiliSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.yetkiliSıralamaKanalı)
  if(!kanal) return;
  let Data = await Users.find()
  Data = Data.filter(x => guild.members.cache.has(x._id) && x.Staffs).sort((a, b) => {
    var aa = Number(a.Staffs.length)
    var bb = Number(b.Staffs.length)
    return bb - aa
  }).map((result, index) => {

    return `\` ${index + 1} \` <@${result._id}> \`${result.Staffs.length} yetkili\``
  })
  if(data && data.leaderboardStaff) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardStaff)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir yetkili sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardStaff`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir yetkili sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardStaff": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait en iyi yetkili çeken sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}

async function teyitSıralaması(guild) {
  let LeaderBoard;
  let Database = await GUILD_SETTINGS.findOne({guildID: guild.id})
  if(!Database) return;
  if(Database && !Database.Ayarlar) return;
  let data = Database.Caches
  let kanal = guild.channels.cache.get(Database.Ayarlar.teyitSıralamaKanalı)
  if(!kanal) return;
  let Data = await Users.find()
  Data = Data.filter(x => guild.members.cache.has(x._id) && x.Records).sort((a, b) => {
    var aa = Number(a.Records.length)
    var bb = Number(b.Records.length)
    return bb - aa
  }).map((result, index) => {

    return `\` ${index + 1} \` <@${result._id}> toplam teyitleri \`${result.Records.length}\` (\`${result.Records.filter(x => x.Gender == "Erkek").length}\` Erkek, \`${result.Records.filter(x => x.Gender == "Kadın").length}\` Kadın)`
  })
  if(data && data.leaderboardRegister) {
    try {
      LeaderBoard = await kanal.messages.fetch(data.leaderboardRegister)
    } catch (err) {
      LeaderBoard = await kanal.send(`Yeni bir teyit sıralama mesajı oluşturuluyor...`)
      await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.leaderboardRegister`]: LeaderBoard.id}}, {upsert: true})
    }
  } else {
    LeaderBoard = await kanal.send(`Yeni bir teyit sıralama mesajı oluşturuluyor...`)
    await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {
      "Caches.leaderboardRegister": LeaderBoard.id
    }}, {upsert: true})
  }
  let embed = new genEmbed().setColor("Random").setAuthor({ name: guild.name, iconURL: guild.iconURL({extension: 'png'})})
  LeaderBoard.edit({content: null,embeds: [embed.setDescription(`Aşağı da **${ayarlar.serverName ? ayarlar.serverName : guild.name}** sunucusuna ait genel teyit sıralaması listelenmektedir.\n\n${Data.slice(0, 30).join("\n")}\n
Bu sıralama <t:${Number(String(Date.now()).substring(0, 10))}:R> düzenlendi.` )]})
}



