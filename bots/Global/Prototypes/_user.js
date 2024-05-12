const { GuildMember, ButtonBuilder, ButtonStyle,  ActionRowBuilder, ChannelType } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const ms = require('ms');
const GUILDS_SETTINGS = require('../Databases/Schemas/Global.Guild.Settings')
const Upstaff = require('../Databases/Schemas/Plugins/Client.Users.Staffs');
const Stats = require('../Databases/Schemas/Plugins/Client.Users.Stats')
// Schema's
    const Users = require('../Databases/Schemas/Client.Users');
    const Punitives = require('../Databases/Schemas/Global.Punitives');
    const Forcebans = require('../Databases/Schemas/Punitives.Forcebans');
    const Jails = require('../Databases/Schemas/Punitives.Jails');
    const Vmutes = require('../Databases/Schemas/Punitives.Vmutes');
    const Mutes = require('../Databases/Schemas/Punitives.Mutes');
    const Leaders = require('../Databases/Schemas/Plugins/Guild.Responsibility');
    const USERS_COMPONENTS = require('../Databases/Schemas/Users.Components')
    const { VK, DC, STREAM, ETKINLIK } = require('../Databases/Schemas/Punitives.Activitys');
    const Unleash = require('../Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const { genEmbed } = require("../Init/Embed");
// Schema's

/**
 * @param {Array} roles 
 * @returns {GuildMember} 
 */

GuildMember.prototype.setRoles = function (roles = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles);
    return this.roles.set(rol).catch(err => {});
}

 /**
 * @param {Array} roles 
 * @returns {GuildMember} 
 */

GuildMember.prototype.recordSetRoles = function (roles = []) {
    let rol = []
    this.roles.cache.clone().filter(e => e.managed).map(e => rol.push(e.id))
    rol.push(...roles)
    if(roller.vipRolü && this.roles.cache.has(roller.vipRolü)) rol.push(roller.vipRolü);
    if(ayarlar.type && roller.tagRolü && !this.roles.cache.has(roller.tagRolü) && this.user.username.includes(ayarlar.tag)) rol.push(roller.tagRolü);
    if(ayarlar.type && roller.tagRolü && this.roles.cache.has(roller.tagRolü)) rol.push(roller.tagRolü)
    if(roller.Buttons && roller.Buttons.vk && this.roles.cache.has(roller.Buttons.vk)) rol.push(roller.Buttons.vk)
    if(roller.Buttons && roller.Buttons.dc && this.roles.cache.has(roller.Buttons.dc)) rol.push(roller.Buttons.dc)
    if(roller.etkinlikKatılımcısı && this.roles.cache.has(roller.etkinlikKatılımcısı)) rol.push(roller.etkinlikKatılımcısı)
    if(roller.cekilisKatılımcısı && this.roles.cache.has(roller.cekilisKatılımcısı)) rol.push(roller.cekilisKatılımcısı)
    return this.roles.set(rol).catch(err => {});
}

 /**
 * @param {String} name
 * @param {String} gender 
 * @param {String} registrant
 * @param {String} state
 * @returns {GuildMember} 
 */

GuildMember.prototype.Register = async function (name, gender = undefined, registrant = undefined) {
    let userData = await Users.findOne({_id: this.id})
    // Fiziksel Kayıt Mantığımız
    let rol;
    let rolver;
    if(gender == "Erkek") {
        rol = roller.erkekRolleri.map(x => this.guild.roles.cache.get(x)).join(",")
        rolver = roller.erkekRolleri
    } else if(gender == "Kadın") {
        rol = roller.kadınRolleri.map(x => this.guild.roles.cache.get(x)).join(",")
        rolver = roller.kadınRolleri
    }
    await this.recordSetRoles(rolver)
    await GUILDS_SETTINGS.updateOne({guildID: this.guild.id}, {$set: {[`Caches.lastRecord`]: this.id}}, {upsert: true})
    let seskanal = registrant.guild.channels.cache.filter(x => x.parentId == kanallar.publicKategorisi && x.type == ChannelType.GuildVoice && x.id != kanallar.sleepRoom && (_statSystem.musicRooms && _statSystem.musicRooms.some(kanal => x.id != kanal))).random()
    let chatkanalı = registrant.guild.channels.cache.get(kanallar.chatKanalı)
    let otomatikTaşıma = ayarlar.otomatikTaşıma || false
    if(this && this.voice && this.voice.channel && otomatikTaşıma) {
        setTimeout(() => {
            if(this) this.send({content: `**Sunucumuza Hoşgeldiniz!** ${ayarlar.serverName} sunucusuna kayıt olduğunuz için Teşekkür Ederiz!
Kayıt işleminiz tamamlandıktan sonra teyit odasında bulunduğunuzdan dolayı **Bot** tarafından otomatik olarak **${seskanal.name}** odasına taşındınız.
Sana İyi Sohbetler Dilerim! :tada: :tada: :tada:`}).catch(err => {})
            if(this.voice) this.voice.setChannel(seskanal).catch(err => {})
        }, 5000);
    } 
    if(kanallar.chatKanalı) {
            let kanal = this.guild.channels.cache.get(kanallar.chatKanalı)
            if(ayarlar.type) {
                if(kanal) {
                    if(this.user.username.includes(ayarlar.tag)) kanal.send(`:tada: ${this} ailemize katıldı! ailemize hoş geldin, İyi Eğlenceler.`).then(x => {setTimeout(() => { x.delete() }, 15250)})
                    if(!this.user.username.includes(ayarlar.tag)) kanal.send(`:tada: ${this} aramıza katıldı! Sen de bizden biri olmak ister misin? O zaman ${ayarlar.serverName} tagı (\` ${ayarlar.tag} \`) almalısın, şimdiden iyi eğlenceler.`).then(x => {setTimeout(() => { x.delete() }, 20000)}) 
                }
            } else {
                if(kanal) kanal.send(`:tada: ${this} ailemize katıldı! ailemize hoş geldin, İyi Eğlenceler.`).then(x => {setTimeout(() => { x.delete() }, 15250)})
            }
        }
    // Fiziksel Kayıt Mantığımız
   
    await Users.updateOne({_id: this.id}, 
            { $set: { "Name": name, "Gender": gender, "Registrant": registrant.id }, $push: { "Names": { Staff: registrant.id, Name: name, State: rol, Date: Date.now() }}}, 
    {upsert: true})
    await Users.updateOne({_id: registrant.id }, { $push: {"Records": { User: this.id, Gender: gender, Date: Date.now() }}  })

    registrant.Leaders("register", 1, {type: "REGISTER", user: this.id})
    registrant.Leaders("teyit", 1, {type: "REGISTER", user: this.id})
    registrant.Leaders("kayıt", 1, {type: "REGISTER", user: this.id})

    let kayıtLog = this.guild.kanalBul("kayıt-log")
    if(kayıtLog) kayıtLog.send({embeds: [new genEmbed().setDescription(`${this} isimli üye ${registrant} yetkili tarafından <t:${String(Date.now()).slice(0, 10)}:R> **${gender}** olarak \`${this.guild.name}\` sunucusuna kayıt edildi.`)]})

}

 /**
 * @param {String} name 
 * @param {String} registrant
 * @param {String} state
 * @returns {GuildMember} 
 */

GuildMember.prototype.Rename = async function (name, registrant = undefined, state = undefined) {
    let userData = await Users.findOne({_id: this.id})
    await Users.updateOne({_id: this.id}, { $set: { "Name": name }, $push: { "Names": { Staff: registrant.id, Name: name, State: state, Date: Date.now() }}}, 
    {upsert: true})
    if(userData && userData.Name) {
     
    } 
}

GuildMember.prototype.removeStaff = async function(lastRole, manuel) {
    let Row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("onukap")
            .setLabel("İlgilen!")
            .setEmoji("925128103741775892")
            .setStyle(ButtonStyle.Secondary)
    )
    let userData = await Users.findOne({_id: this.id})
    await Users.updateOne({_id: this.id}, { $set: { Responsibilitys: {}} }, {upsert: true})
    if(userData && userData.Staff && userData.StaffGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.StaffGiveAdmin })
          if(Yetkili && Yetkili.Staffs) {
              const LanYarramBakSikildiler = this.guild.members.cache.get(userData.StaffGiveAdmin)
              if(LanYarramBakSikildiler && !manuel) LanYarramBakSikildiler.send({content: `
${this} (**${this.user.username}**)
ID: ${this.id}`, embeds: [new genEmbed()
                .setDescription(`Merhaba ${LanYarramBakSikildiler} sunucumuza ${this} kullanıcısını yetkili olarak başlatmışsınız fakat <t:${String(Date.now()).slice(0, 10)}:R> yetkiyi bıraktı.`)
               ]}).catch(err => { })
              const findUser = Yetkili.Staffs.find(cartel => cartel.id == this.id);
              await Users.updateOne({ _id: userData.StaffGiveAdmin }, { $pull: { "Staffs": findUser } }, { upsert: true })
              client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.staff, "Yetkili")
          }
    }
    if(userData && userData.Staff) {
        await Users.updateOne({ _id: this.id }, { $set: { "Staff": false, "StaffGiveAdmin": new String() } }, { upsert: true })
        let Data = await Upstaff.findOne({_id: this.id})
        await Upstaff.deleteOne({_id: this.id})
        await Stats.updateOne({ guildID: this.guild.id, userID: this.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map(), taskVoiceStats: new Map() },  { upsert: true });
	if(!lastRole) lastRole = this.roles.cache
        if(!manuel) {
            let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
            let arr = []
            lastRole.filter(rol => altYetki.position <= rol.position).forEach(async (rol) => {
                await arr.push(rol.id)
            })
            if(arr.length <= 0) {
                lastRole.forEach(rol => {
                    arr.push(rol.id)
                })
            }
            await Unleash.updateOne({_id: this.id}, {$set: {"unleashRoles": arr}, $inc: {"unleashPoint": 1}}, {upsert: true})
            let yetkiyiBırakan = this.guild.kanalBul("yetki-bırakan")
            let embeds = new genEmbed()
             .setDescription(`${this} isimli kullanıcı yetkiyi <t:${String(Date.now()).slice(0, 10)}:R> saldı.`);
             if(Data) {
                let sorumlusu = this.guild.members.cache.get(userData.StaffGiveAdmin)
                embed.addFields(
                    {
                      name: `Detaylar`,
                      value: `Yetkiye Başlatan: ${
                        userData.StaffGiveAdmin 
                          ? sorumlusu 
                            ? `${sorumlusu} (\`${sorumlusu.displayName}\`)` 
                            : `<@${userData.StaffGiveAdmin}> (\`Sunucudan Ayrılmış!\`)`  
                          : `\`Tespit Edilemedi!\``
                      }\nYetkide Kalma Süresi: \`${
                        Data.Baslama 
                          ? sureCevir(Date.now() - Date.parse(Data.Baslama)) 
                          : `Tespit Edilemedi!`
                      }\`\nYetkiye Başlama Tarihi: ${
                        Data.Baslama 
                          ? `<t:${String(Date.parse(Data.Baslama)).slice(0, 10)}:R> (<t:${String(Date.parse(Data.Baslama)).slice(0, 10)}:F>)` 
                          : `\`Tespit Edilemedi!\``
                      }`
                    }
                  );
             }


             embeds.addFields({ name: "Son rolleri şunlardır", value: `${arr.map(x => this.guild.roles.cache.get(x)).join(", ")}`})
            if(yetkiyiBırakan) yetkiyiBırakan.send({content: `${this} [**\` ${this.id} \`**]
${[...roller.altYönetimRolleri, ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].filter(x => this.guild.roles.cache.get(x)).map(x => this.guild.roles.cache.get(x))}`, embeds: [
    embeds
], components: [Row]}).then((msg) => {
    let collector = msg.createMessageComponentCollector({max: 1})
    collector.on('collect', async (i) => {
        let kapan = this.guild.members.cache.get(i.user.id)
        if(kapan) {
            Row.components[0].setDisabled(true)
            Row.components[0].setLabel(`${kapan.user.username}`)
            Row.components[0].setStyle(ButtonStyle.Success)
            msg.edit({components: [Row]})
            this.send({content: `Merhaba! ${this}
Sunucumuz da yetkiyi bıraktığınız için çok üzgünüz. Neden bıraktığınızı bilmiyoruz bizlere belirtmek ister misiniz?
O zaman bana ${kapan} (${kapan.user.username} | ${kapan.id}) yazarsanız derdinize deva olabiliriz.`}).then(a => {
                i.reply({content: `Başarıyla ${this} üyesine yetkiyi bıraktığı için DM üzerinden mesaj ile bildirildi. Yine de sen yazmak ister misin?`, ephemeral: true})
            }).catch(async (err) => {
                removeTagLog.send(`Merhaba! ${kapan},
İlgilenmeye çalıştığınız kullanıcının **DM** kapalı olduğu için ben mesaj gönderemedim. Arkadaş ekleyip sen atmak ister misin?`);
                await i.deferUpdate().catch(err => {});
            })
            kapan.Leaders("Yetkili", 5.00, {type: "STAFF_CHECK", user: this.id})
            await USERS_COMPONENTS.updateOne({_id: kapan.id}, {$push: {"Checks": {
                target: this.id,
                date: Date.now(),
                type: "STAFF"
            }}}, {upsert: true})
            
        }
    })
});
        }
    }
}
function sureCevir (duration) {  
    let arr = []
    if (duration / 3600000 > 1) {
      let val = parseInt(duration / 3600000)
      let durationn = parseInt((duration - (val * 3600000)) / 60000)
      
      arr.push(`${val} Saat`)
      arr.push(`${durationn} Dk.`)
    } else {
      let durationn = parseInt(duration / 60000)
      arr.push(`${durationn} Dk.`)
    }
    return arr.join(", ") 
    };
GuildMember.prototype.removeTagged = async function () {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Tagged && userData.TaggedGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.TaggedGiveAdmin }) 
           if(Yetkili && Yetkili.Taggeds) {
                const koşKoşBabanıSikiyorlar = this.guild.members.cache.get(userData.TaggedGiveAdmin)
                const findUser = Yetkili.Taggeds.find(cartel => cartel.id == this.id);
                await Users.updateOne({ _id: userData.TaggedGiveAdmin }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                client.Upstaffs.removePoint(userData.TaggedGiveAdmin, -_statSystem.points.tagged, "Taglı")
            } 
          await Users.updateOne({ _id: this.id }, { $set: { "Tagged": false, "TaggedGiveAdmin": new String() } }, { upsert: true })
        }
}

GuildMember.prototype.dangerRegistrant = async function () {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name && userData.Registrant) {
        let Yetkili = await Users.findOne({_id: userData.Registrant }) 
          if(Yetkili && Yetkili.Records) {
              const koşAnanıSikiyorlar = this.guild.members.cache.get(userData.Registrant)
              if(koşAnanıSikiyorlar) koşAnanıSikiyorlar.send({content: `Kayıt ettiğiniz ${this} (${this.user.username}) (**Ceza Puanı**: \`${await this.cezaPuan()}\`) üyesi sunucuda **Kural Dışı** eylem sergiledi ve cezalandırıldı.
Bunun sonucunda sana düşen kayıt ettiğiniz üyenin sorumluluğunu almalısın ve uyarmalısın.`}).catch(err => {})
            } 
      }
}

GuildMember.prototype._views = async function () {
    return new Promise(async (resolve, reject) => {
            await Users.updateOne({ _id: this.id }, { $inc: { "Views": 1 } }, { upsert: true }).catch(err => {
                reject(err)
            })
            let _cached = await Users.findOne({_id: this.id})
            resolve(`Başarıyla ${this.user.username} üyesinin görüntülemesi ${_cached.Views || 0} oldu.`)
    })
}

 /**
 * @returns {GuildMember} 
 */
  GuildMember.prototype.Delete = async function (type = "default") {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name && userData.Registrant) {
        let Yetkili = await Users.findOne({_id: userData.Registrant }) || {}
          if(Yetkili && Yetkili.Records) {
              const koşAnanıSikiyorlar = this.guild.members.cache.get(userData.Registrant)
              const findUser = Yetkili.Records.find(cartel => cartel.User == this.id);
              await Users.updateOne({ _id: userData.Registrant }, { $pull: { "Records": findUser } }, { upsert: true })
              await client.Upstaffs.removePoint(userData.Registrant, -_statSystem.points.record, "Kayıt")
          } 
      }
}

/**
 * @returns {GuildMember} 
 */
GuildMember.prototype.yetkiliCezaPuan = async function(action, number) {
    let data = await Users.findOne({_id: this.id})
    if(!data) {
       await Users.updateOne({_id: this.id}, {$set: {"staffCriminalPoint": 200}}, {upsert: true})
       data = await Users.findOne({_id: this.id})
       return `${Number(data.staffCriminalPoint)}`;
    } 
    if(data && !action) {
        if(data.staffCriminalPoint <= 0) {
            return "BITTI"
        } else {
            return `${Number(data.staffCriminalPoint)}`
        }
    }
    if(data && action == "reset") {
         await Users.updateOne({_id: this.id}, {$set: {"staffCriminalPoint": 200}})
         return "reset"
    }
    if(data && action == "process") {
        data = await Users.findOne({_id: this.id})
        if(data.staffCriminalPoint <= 0) {
            await Users.updateOne({_id: this.id}, {$set: {"staffCriminalPoint": 0}}) 
            return "BITTI"
        }
        let newPoint = Number(data.staffCriminalPoint - number)
        await Users.updateOne({_id: this.id}, {$set: {"staffCriminalPoint": Number(newPoint)}})
        data = await Users.findOne({_id: this.id})
        return `${Number(data.staffCriminalPoint)}`;
    } else {
        return `${Number(data.staffCriminalPoint)}`;
    }
}


 /**
  * @returns {GuildMember}
  */

GuildMember.prototype.cezaPuan = async function(check, güm) {
        let res = await Punitives.find({ Member: this.id })
        if (!res) return 0
        let filArray = res.map(x => (x.Type))
        let Mute = filArray.filter(x => x == "Metin Susturulma").length || 0
        let VMute = filArray.filter(x => x == "Ses Susturulma").length || 0
        let Jail = filArray.filter(x => x == "Cezalandırılma").length || 0
        let Ban = filArray.filter(x => x == "Yasaklama").length || 0
        let Underworld = filArray.filter(x => x == "Underworld").length || 0
        let TeyitYasakli = filArray.filter(x => x == "Teyit Yasaklı").length || 0
        let kalkamayanAmcıkBan = filArray.filter(x => x == "Kalkmaz Yasaklama").length || 0
        let Warn = filArray.filter(x => x == "Uyarılma").length || 0
        let cezaPuanı = (Mute * 8) + (VMute * 8) + (Jail * 18) + (Ban * 30) + (Underworld * 20) + (TeyitYasakli * 20) + (kalkamayanAmcıkBan * 50) + (Warn * 2)
        if(check) {
            let logKanalı = this.guild.kanalBul("ceza-puan") || this.guild.kanalBul("oto-ceza") 
            if((roller.Yetkiler && roller.Yetkiler.some(x => this.roles.cache.has(x))) && cezaPuanı >= 50) {
                if(cezaPuanı >= 52) {
                    let anlıkYetkiliCezaPuan = await this.yetkiliCezaPuan()
                    let kesilecekPuan = Math.floor(cezaPuanı / 2)
                    this.yetkiliCezaPuan("process", Number(kesilecekPuan))
                } 
                let yetkiliCezaPuanı = await this.yetkiliCezaPuan()
                if(yetkiliCezaPuanı == "BITTI") {
            
                    this.removeStaff(this.roles.cache, true)
                    await Users.updateOne({ _id: this.id }, { $push: { "StaffLogs": {
                        Date: Date.now(),
                        Process: "OTOMATİK ÇEKİLDİ",
                        Role: this.roles.hoist ? this.roles.hoist.id : roller.başlangıçYetki,
                        Author:client.user.id
                    }}}, { upsert: true }) 
                    let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
                    if(altYetki) await this.roles.remove(this.roles.cache.filter(rol => altYetki.position <= rol.position))
                    await this.yetkiliCezaPuan("reset")
                    this.setRoles(roller.şüpheliRolü)
                    if(logKanalı) return logKanalı.send({content: `${this} Yetkilisinin Yetkili Ceza Notu Düştüğü İçin Yaptığı Kural-Dışı Eylemlere Yaptırım Uygulanarak Yetkisi Çekildi Ve Şüpheli Konumuna Getirildi.`})
                }
                
                if(logKanalı) logKanalı.send({content: `${this} Yetkilisinin Ceza Puanı Güncellendi. Fakat **50** Ceza Puanını Geçtiği İçin "Yetkili Ceza Notu" Sisteminden Düşüş Sağlanacak.
Düşüm Sonrası Yetkili Ceza Notu **0** Altına İndiğinde Otomatik Olarak Yetkisi Çekilecektir. Yetkili Ceza Notu: \`${yetkiliCezaPuanı}\` (Anlık Ceza Puanı: \`${cezaPuanı}\`)`})
            } else if ((roller.Yetkiler && roller.Yetkiler.some(x => this.roles.cache.has(x)))) {
                let yetkiliCezaPuanı = await this.yetkiliCezaPuan()
                if(logKanalı) logKanalı.send({content: `${this} Yetkilisinin Ceza Puanı Güncellendi. Yetkili Ceza Notu: \`${yetkiliCezaPuanı}\` (Anlık Ceza Puanı: \`${cezaPuanı}\`)`})
            } 
            
            if((roller.Yetkiler && !roller.Yetkiler.some(x => this.roles.cache.has(x))) && cezaPuanı >= 50) {
                if(güm) this.setRoles(roller.şüpheliRolü)
                if(logKanalı) logKanalı.send({content: `${this} Üyesi **50** Ceza Puanını ${güm ? `Geçtiği İçin Otomatik Olarak Şüpheli Hesap Konumuna Gönderildi.` : `Geçti Fakat Son Atılan Cezası Şüpheli Konumundan Daha Üstün Olduğu İçin Gönderilemedi.`} Anlık Ceza Puanı: \`${cezaPuanı}\``})

            } else if((roller.Yetkiler && !roller.Yetkiler.some(x => this.roles.cache.has(x)))){
                if(logKanalı) logKanalı.send({content: `${this} Üyesinin Ceza Puanı Güncellendi. Anlık Ceza Puanı: \`${cezaPuanı}\``})
            }
        }
        return cezaPuanı;
}

 /**
  * @returns {GuildMember}
  */

GuildMember.prototype.Left = async function (lastRole) {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name) {
        await Users.updateOne({_id: this.id}, 
            { $push: { "Names": { Name: userData.Name, State: "Sunucudan Ayrılma", Date: Date.now() }}}, 
        {upsert: true})
    } 
    await Users.updateOne({_id: this.id}, { $set: { Responsibilitys: {}} }, {upsert: true})
    if(userData && userData.Tagged && userData.TaggedGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.TaggedGiveAdmin }) || {}
           if(Yetkili && Yetkili.Taggeds) {
                const koşKoşBabanıSikiyorlar = this.guild.members.cache.get(userData.TaggedGiveAdmin)
                const findUser = Yetkili.Taggeds.find(cartel => cartel.id == this.id);
                await Users.updateOne({ _id: userData.TaggedGiveAdmin }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                await client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.tagged, "Taglı")
            } 
          await Users.updateOne({ _id: this.id }, { $set: { "Tagged": false, "TaggedGiveAdmin": new String() } }, { upsert: true })
        }

    // Yetkiliyse Yetkili Sisteminden Çıkartma
    if(userData && userData.Staff && userData.StaffGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.StaffGiveAdmin }) || {}
          if(Yetkili && Yetkili.Staffs) {
              const BabanıSikeyim = this.guild.members.cache.get(userData.StaffGiveAdmin)
              if(BabanıSikeyim) BabanıSikeyim.send({embeds: [new genEmbed().setDescription(`${BabanıSikeyim} Merhaba, ${this} (\`${this.id}\`) isimli çektiğin yetkili yetkiyi sunucudan çıkarak <t:${String(Date.now()).slice(0, 10)}:R> bıraktı.`)]}).catch(err => { })
              const findUser = Yetkili.Staffs.find(cartel => cartel.id == this.id);
              await Users.updateOne({ _id: userData.StaffGiveAdmin }, { $pull: { "Staffs": findUser } }, { upsert: true })
              client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.staff, "Yetkili")
          } 
      }
      if(userData && userData.Staff) {
        await Users.updateOne({ _id: this.id }, { $set: { "Staff": false, "StaffGiveAdmin": new String() } }, { upsert: true })
        await Upstaff.deleteOne({_id: this.id})
        await Stats.deleteOne({userID: this.id})
        let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
        let arr = []
        this.roles.cache.filter(rol => altYetki.position <= rol.position).forEach(async (rol) => {
            await arr.push(rol.id)
        })
        if(!lastRole) lastRole = this.roles.cache
        if(arr.length <= 0) {
            lastRole.forEach(rol => {
                arr.push(rol.id)
            })
        }
        await Unleash.updateOne({_id: this.id}, {$set: {"unleashRoles": arr}, $inc: {"unleashPoint": 1}}, {upsert: true})
        let yetkiyiBırakan = this.guild.kanalBul("yetki-bırakan")
        if(yetkiyiBırakan) yetkiyiBırakan.send({content: `${this} [**\` ${this.id} \`**]
${[...roller.altYönetimRolleri, ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => this.guild.roles.cache.get(x))}`,embeds: [new genEmbed().setDescription(`${this} isimli eski yetkili, yetkiyi sunucudan ayrılarak **<t:${String(Date.now()).slice(0, 10)}:R>** yetkisini saldı.`).addFields({ name: "Son rolleri şunlardır", value: `${arr.map(x => this.guild.roles.cache.get(x)).join(", ")}`})]}) 
    }
}


GuildMember.prototype.Leaders = async function(text, point, option = {
    type: "MORE",
}) {
    let log = this.guild.channels.cache.get(kanallar.sorumlulukLog)
    let leaders =  await Leaders.find({})
    let roles = leaders.filter(x => {
        let name = String(x.name).toLocaleLowerCase()
        return this.guild.roles.cache.has(x.role) && name.includes(text)

    }).map(x => x)
    if(roles && roles.length > 0 && roles.some(b => this.roles.cache.has(b.role))) {
        let Data = await Users.findOne({_id: this.id})
        if(!Data) return;
        let detay = {}
        if(option.type == "VOICE") detay = {
            type: "SES",
            channel: option.channel
        }
        if(option.type == "MESSAGE") detay = {
            type: "MESAJ",
            channel: option.channel
        }
        if(option.type == "TAGGED") detay = {
            type: "TAGLI",
            channel: option.user
        }
        if(option.type == "TAG_CHECK") detay = {
            type: "TAG SALAN İLE İLGİLENME",
            channel: option.user
        }
        if(option.type == "STAFF_CHECK") detay = {
            type: "YETKİ SALAN İLE İLGİLENME",
            channel: option.user
        }
        if(option.type == "STAFF") detay = {
            type: "YETKİLİ",
            user: option.user
        }
        if(option.type == "INVITE") detay = {
            type: "DAVET",
            user: option.user
        }
        if(option.type == "REGISTER") detay = {
            type: "KAYIT",
            user: option.user
        }
        if(option.type == "ROLE") detay = {
            type: "ROL DENETİM",
            role: option.role,
            channel: option.channel
        }
        if(option.type == "CEZA") detay = {
            type: "CEZA"
        }
        if(option.type == "MORE") detay = {
            type: "DİĞER"
        }
        if(option.type == "ETKINLIK") detay = {
            type: "ETKİNLİK BAŞLATMA"
        }
        if(option.type == "KONSER") detay = {
            type: "KONSER BAŞLATMA"
        }
        for (let index = 0; index < roles.length; index++) {
            let sorumluluk = roles[index];
            let rol = this.guild.roles.cache.get(sorumluluk.role)
            if(!rol) return;
            if(!this.roles.cache.has(rol.id)) return;
            await Users.updateOne({_id: this.id}, { $inc: { [`Responsibilitys.${sorumluluk.role}`]: point} })
            Data =  await Users.findOne({_id: this.id})
            let isimne = String(rol.name).toLocaleLowerCase();
            let uyarlama ='';
            let header = '';
            if(isimne.includes("lider")) {
                uyarlama = `Liderliğinde`
                header = `Lider`
            } else if(isimne.includes("sorumlu") || isimne.includes("sorumluluğu") || isimne.includes("sorum")) {
                uyarlama = `Sorumluluğunda`
                header = `Sorumluluk`
            } else {
                uyarlama = `Rolünde`
                header = `Lider/Sorumluluk`
            }
            client.Upstaffs.addPoint(this.id, point, "Sorumluluk")
            let embed = new genEmbed()
            .setAuthor({ name: `${this.displayName} ${header} Puan'ı Kazandı!`, iconURL: this.user.displayAvatarURL({extension: 'png'})})
            .setDescription(`
Bu İşlemden **${point.toFixed(2)} Puan** Kazandı. Toplamda ${rol} ${uyarlama} **${Data.Responsibilitys[rol.id].toFixed(2)} Puan** Kazandı.
Bu İşlem <t:${String(Date.now()).slice(0, 10)}:R> / <t:${String(Date.now()).slice(0, 10)}:F> Tarihinde Yapıldı.
Yapılan İşlem Türü İse "**${detay.type}**" Olarak Tespit Edildi.`).setFooter({ name: this.guild.name, iconURL: this.guild.iconURL({extension: 'png'})})
            if(option.user)  {
                let target = this.guild.members.cache.get(option.user)
                embed.addFields({ name: `İşlem Yapılan Kullanıcı`, value: `${ target ? `${target} (\`${target.id}\`)` : `<@${option.user}> (\`Sunucudan Ayrılmış\`)`}`})
            }
            if(option.channel)  {
                let target = this.guild.channels.cache.get(option.channel) || this.guild.channels.cache.get(option.channel.id)
                embed.addFields({ name: `İşlem Yapılan Kanal`, value: `${target ? `${target}` : `@deleted-channel`}`})
            }
            if(option.role)  {
                let target = this.guild.roles.cache.get(option.role)
                embed.addFields({ name: `İşlem Yapılan Rol`, value: `${target ? `${target}` : `@deleted-roles`}`})
            }

            if(log) log.send({embeds: [embed]})
        }
    }
}

/**
 * 
 * @param {String} type 
 * @param {GuildMember} staff 
 * @param {String} reason 
 * @param {String} message 
 * @param {Date} duration 
 * @returns 
 */


GuildMember.prototype.addPunitives = async function(type, staff, reason = "Sebep belirtilmedi.", message, duration, muteFlood, rulesFlood, nofi = 1) {
    let cezano = await Punitives.countDocuments()
    cezano = cezano == 0 ? 1 : cezano + 1;
        if(type == 1) type = "Kalkmaz Yasaklama"
        if(type == 2) type = "Yasaklama"
        if(type == 3) type = "Cezalandırılma"
        if(type == 4) type = "Ses Susturulma"
        if(type == 5) type = "Metin Susturulma"   
        if(type == 6) type = "Uyarılma"
        if(type == 7) type = "Teyit Yasaklı"
        if(type == 8) type = "Underworld"
        if(type == 9) type = "Streamer Cezalandırma"
        if(type == 10) type = "VK Cezalandırma"
        if(type == 11) type = "DC Cezalandırma"
        if(type == 12) type = "Etkinlik Cezalandırma"

        let ceza;
        let islem;
        if(duration) {
            ceza = new Punitives({ 
                No: cezano,
                Member: this.id,
                Staff: staff.id,
                Type: type,
                Reason: reason,
                Duration: Date.now()+ms(duration),
                Date: Date.now()
            })
        } else {
            ceza = new Punitives({ 
                No: cezano,
                Member: this.id,
                Staff: staff.id,
                Type: type,
                Reason: reason,
                Date: Date.now()
            })
        }
        ceza.save().catch(e => console.error(e));
        let logKanal = [
            {type: "Kalkmaz Yasaklama", channel: "forceban-log"},
            {type: "Yasaklama", channel: "ban-log"},
            {type: "Underworld", channel: "underworld-log"},
            {type: "Cezalandırılma", channel: "jail-log"},
            {type: "Ses Susturulma", channel: "sesmute-log"},
            {type: "Metin Susturulma", channel: "mute-log"},
            {type: "Uyarılma", channel: "uyarı-log"},
            {type: "Teyit Yasaklı", channel: "teyit-yasaklı-log"},
        ]

        let _findLogChannel = logKanal.find(x => x.type == type)
        if(_findLogChannel) {
            let findedChannel = message.guild.kanalBul(_findLogChannel.channel)
            if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter({ text: `${ayarlar ? ayarlar.embedSettings ? ayarlar.embedSettings.Footer ? `${ayarlar.embedSettings.Footer}` : message.guild.name : message.guild.name : message.guild.name } • Ceza Numarası: #${cezano}`, iconURL: this.user.avatarURL({extension: 'png'})}).setDescription(`${this.toString()} üyesine <t:${String(Date.now()).slice(0, 10)}:F> tarihinde ${duration ? `${moment.duration(ms(duration)).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika]')} boyunca` : ``} \`${reason}\` nedeniyle ${staff.toString()} tarafından "${type}" türünde ceza işlemi uygulandı.`)]})
        }
        if(nofi == 1 && !muteFlood && !rulesFlood) await message.reply(`Başarıyla ${this.toString()} isimli kullanıcıya "__${type}__" işlemi uygulandı. (\`Ceza Numarası: #${cezano}\`)`).then((a) => {
        
            setTimeout(() => {
                a.delete().catch(err => {})
            }, 7500)
        })       
        staff.Leaders("sorun", 1, {type: "CEZA", user: this.id})
        staff.Leaders("criminal", 1, {type: "CEZA", user: this.id})
        staff.Leaders("ceza", 1, {type: "CEZA", user: this.id})
        await this.send({content: `Sunucumuz da \`${staff.user.username}\` tarafından **${reason}** sebebi ile ${type == "Kalkmaz Yasaklama" ? 
                "tamamiyle kalkmaz yasaklamaya tabi tutuldun."
            : type == "Yasaklama" ? 
                "yasaklandın."
            : type == "Cezalandırılma" ? 
                "cezalıya gönderildin."
            : type == "Ses Susturulma" ? 
                "seste susturuldun."
            : type == "Metin Susturulma" ?
                "metin kanallarında susturuldun."
            : type == "Underworld" ?
                "Underworld'e gönderildin."
            : type == "Uyarılma" ?
            "uyarıldın."
            : `"${type}" türünde ceza-i işlem uygulandı.`} ${duration ? `Ceza bitiş tarihi \`${tarihsel(Date.now()+ms(duration))}\`. Eğer bu konu hakkında bir itirazın var ise üst yetkililerimize ulaşmaktan çekinme!` : "Eğer bu konu hakkında bir itirazın var ise üst yetkililerimize ulaşmaktan çekinme!"} (**Ceza Numarası**: \` #${cezano} \`)`}).catch(err => {
           
        })
        if(nofi == 0 && !muteFlood && !rulesFlood) await message.editReply({embeds: [new genEmbed().setDescription(`${this.toString()} isimli üyeye **${reason}** sebebiyle ${duration ? `\`${moment.duration(ms(duration)).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika]')}\` boyunca` : ``} ${type == "Kalkmaz Yasaklama" ? 
        "tamamiyle kalkmaz yasaklamaya tabi tutuldun."
    : type == "Yasaklama" ? 
        "yasakladın."
    : type == "Cezalandırılma" ? 
        "cezalıya gönderdin."
    : type == "Ses Susturulma" ? 
        "seste susturdun."
    : type == "Metin Susturulma" ?
        "metin kanallarında susturdun."
    : type == "Underworld" ?
        "Undeworld'e gönderdin."
    : type == "Uyarılma" ?
    "uyardın."
    : `"${type}" türünde ceza-i işlem uygulandı.`} ${message.guild.emojiGöster(emojiler.Onay)}`).setFooter({ name: `${this.user.username} • Ceza Numarası: #${cezano} • ${type}`, iconURL: this.user.avatarURL({extension: 'png'})})], components: []})
        switch(type) {
            case "Kalkmaz Yasaklama": {
                await this.guild.members.ban(this.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Forceban": 1 } })
                islem = new Forcebans({
                    No: ceza.No,
                    _id: this.id,
                })
                
                return await islem.save(),this.cezaPuan(true);
            }
            case "Yasaklama": {
                    await this.guild.members.ban(this.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Ban": 1 } }),this.cezaPuan(true)
            }
            case "Atılma": {
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Kick": 1 } });
            }
            case "Streamer Cezalandırma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable && roller.streamerCezalıRolü) await this.roles.add(roller.streamerCezalıRolü).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Stream": 1 } })
                if(duration) {
                    islem = new STREAM({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new STREAM({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "VK Cezalandırma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable && roller.vkCezalıRolü) await this.roles.add(roller.vkCezalıRolü).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Vk": 1 } })
                if(duration) {
                    islem = new VK({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new VK({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "Etkinlik Cezalandırma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable && roller.etkinlikCezalıRolü) await this.roles.add(roller.etkinlikCezalıRolü).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Etkinlik": 1 } })
                if(duration) {
                    islem = new ETKINLIK({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new ETKINLIK({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "DC Cezalandırma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable && roller.dcCezalıRolü) await this.roles.add(roller.dcCezalıRolü).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Dc": 1 } })
                if(duration) {
                    islem = new DC({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new DC({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "Cezalandırılma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable) await this.setRoles(roller.jailRolü)

                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Jail": 1 } })
                if(duration) {
                    islem = new Jails({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Jails({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save(),this.cezaPuan(true);
            }
            case "Ses Susturulma": {
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.VoiceMute": 1 } })
                if(duration) { 
                    islem = new Vmutes({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Vmutes({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                if(this && this.voice) await this.voice.setMute(true).catch(err => {})
                return await islem.save(),this.cezaPuan(true, true);
            }
            case "Metin Susturulma": {
                if(this && this.manageable) await this.roles.add(roller.muteRolü)
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Mutes": 1 } })
                if(duration) {
                    islem = new Mutes({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Mutes({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save(),this.cezaPuan(true, true);
            }
            case "Teyit Yasaklı": {
                await this.voice.disconnect().catch(err => {})
                if(this) await this.setRoles(roller.şüpheliRolü)
                return this.cezaPuan(true)
            }
            case "Underworld": {
                await this.voice.disconnect().catch(err => {})
                if(this) await this.setRoles(roller.underworldRolü)
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Underworld": 1 } }),this.cezaPuan(true)
            }
            case "Uyarılma": {
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Warns": 1 } }),this.cezaPuan(true, true)
            }
        }
} 



