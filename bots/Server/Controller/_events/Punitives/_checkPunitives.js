const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require('../../../../Global/Init/Embed');

const forceBans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const Mutes = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const voiceMutes = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const Jails = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {VK, DC, STREAM, ETKINLIK} = require('../../../../Global/Databases/Schemas/Punitives.Activitys');

/**
* @param {Client} client 
*/

 module.exports = async () => {
    let _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = global.ayarlar = _findServer.Ayarlar
    roller = global.roller = _findServer.Ayarlar
    kanallar = global.kanallar = _findServer.Ayarlar
    
    setInterval(async () => {
        let köpekoçlar = await Jails.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        köpekoçlar.forEach(async (ceza) => {
            _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
            ayarlar = global.ayarlar = _findServer.Ayarlar
            roller = global.roller = _findServer.Ayarlar
            kanallar = global.kanallar = _findServer.Ayarlar
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await Jails.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                await Jails.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
                let User = await Users.findOne({ _id: ceza._id })
                if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
                    uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
                    if(User.Gender == "Erkek") uye.setRoles(roller.erkekRolleri)
                    if(User.Gender == "Kadın") uye.setRoles(roller.kadınRolleri)
                    if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri)
                    if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü).catch(err => {}) 
                } else {
                  if(roller.kayıtsızRolleri)  uye.setRoles(roller.kayıtsızRolleri).catch(err => {}) 
                  if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                  if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`)
                  if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`)
                  if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
                }   
            } else {
               if(uye && !uye.roles.cache.get(roller.jailRolü)) await uye.setRoles(roller.jailRolü)
            }
        })
    }, 3000)

    setInterval(async () => {
        let OrospucocuklarıKüfürEtti = await Mutes.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        OrospucocuklarıKüfürEtti.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await Mutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.muteRolü)  await uye.roles.remove(roller.muteRolü).catch(err => {})
                await Mutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(uye && !uye.roles.cache.get(roller.muteRolü)) await uye.roles.add(roller.muteRolü).catch(err => {})
            }
        })
    }, 5000)

    setInterval(async () => {
        let Sesmute = await voiceMutes.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        Sesmute.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await voiceMutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(uye && uye.voice.channel) await uye.voice.setMute(false).catch(err => {})
                await voiceMutes.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                
                if(uye && uye.voice.channel) {
                    if(ayarlar && ayarlar.sorunCozmeKategorisi && uye.voice.channel.parentId == ayarlar.sorunCozmeKategorisi) return;
                    await uye.voice.setMute(true).catch(err => {})
                } 
            }
        })
    }, 7500);

    setInterval(async () => {
        let VKDATA = await VK.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        VKDATA.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await VK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.vkCezalıRolü) await uye.roles.remove(roller.vkCezalıRolü).catch(err => {})
                await VK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(uye && !uye.roles.cache.get(roller.vkCezalıRolü)) await uye.roles.add(roller.vkCezalıRolü).catch(err => {})
            }
        })
    }, 30000);

    setInterval(async () => {
        let STREAMDATA = await STREAM.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        STREAMDATA.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await STREAM.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.streamerCezalıRolü) await uye.roles.remove(roller.streamerCezalıRolü).catch(err => {})
                await STREAM.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(uye && !uye.roles.cache.get(roller.streamerCezalıRolü)) await uye.roles.add(roller.streamerCezalıRolü).catch(err => {})
            }
        })
    }, 25000);

    setInterval(async () => {
        let DCDATA = await DC.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        DCDATA.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await DC.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.dcCezalıRolü) await uye.roles.remove(roller.dcCezalıRolü).catch(err => {})
                await DC.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(uye && !uye.roles.cache.get(roller.dcCezalıRolü)) await uye.roles.add(roller.dcCezalıRolü).catch(err => {})
            }
        })
    }, 45000);

    setInterval(async () => {
        let ETKINLIKDATA = await ETKINLIK.find({})
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        ETKINLIKDATA.forEach(async (ceza) => {
            let uye = guild.members.cache.get(ceza._id)
            if(!uye && ceza.Duration && Date.now() >= ceza.Duration) {
                await ETKINLIK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            }
            if (uye && ceza.Duration && Date.now() >= ceza.Duration) { 
                if(roller.etkinlikCezalıRolü) await uye.roles.remove(roller.etkinlikCezalıRolü).catch(err => {})
                await ETKINLIK.deleteOne({_id: ceza._id})
                if(await Punitives.findOne({No: ceza.No})) await Punitives.updateOne({ No: ceza.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
            } else {
                if(uye && !uye.roles.cache.get(roller.etkinlikCezalıRolü)) await uye.roles.add(roller.etkinlikCezalıRolü).catch(err => {})
            }
        })
    }, 60000);
 }
 
 module.exports.config = {
     Event: "ready"
 };

