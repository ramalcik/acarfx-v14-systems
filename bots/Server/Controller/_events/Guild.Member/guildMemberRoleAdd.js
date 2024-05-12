const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
const yetkiSistemi = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs')
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks')
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { GuildMember, Role, AuditLogEvent } = require('discord.js');
/**
 * 
 * @param {GuildMember} oldMember 
 * @param {GuildMember} newMember 
 * @returns 
 */
module.exports = async (oldMember, newMember) => {
    let _staffs = require("../../../../Global/Plugins/Staff/Sources/Global.Staff.Settings")
    const entry = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || entry.executor.bot || entry.createdTimestamp < (Date.now() - 5000)) return;  
    let yapan = newMember.guild.members.cache.get(entry.executor.id)
    if(!yapan) return;
    let Database = await GUILD_SETTINGS.findOne({guildID: newMember.guild.id})
    roller = Database.Ayarlar
    ayarlar = Database.Ayarlar

    newMember.roles.cache.forEach(async (role) => {
        if (!oldMember.roles.cache.has(role.id)) {
            
           if(_staffs.staffs.some(x => role.id == x.rol) && roller.altilkyetki != role.id && roller.ilkYetki != role.id) {
                let guild = newMember.guild
                if(!guild) return;
                let added = guild.members.cache.get(entry.executor.id)
                if(added) added.send({content: `Merhaba ${added}! ${newMember} kişisine, el ile yetkili rol verdiğin için kişinin @${role.name} rolü alındı, yetkili rol vermek için \`.yetkili ${newMember}\` komutunu kullan.`}).catch(err => {})
            } else {
                let görevGetir = await Tasks.findOne({ roleID: role.id }) || await Tasks.findOne({ roleID: role.id })
                let KullaniciData = await Users.findOne({_id: newMember.id})
                let yetkiliBilgisi = await yetkiSistemi.findOne({_id: newMember.id})
                if(görevGetir && !yetkiliBilgisi) {
                    await yetkiSistemi.updateOne({ _id: newMember.id }, { $set: { "staffNo": 1, "staffExNo": 0, "Point": 0, "ToplamPuan": 0, "Baslama": Date.now(), "Yönetim": true } }, {upsert: true}); 
                    await Users.updateOne({ _id: newMember.id }, { $set: { "Staff": true, "StaffGiveAdmin": entry.executor.id } }, { upsert: true })
                    await Users.updateOne({ _id: newMember.id }, { $push: { "StaffLogs": {
                        Date: Date.now(),
                        Process: "YETKİ VERİLME",
                        Role: role.id,
                        Author: entry.executor.id
                      }}}, { upsert: true }) 
                } 
                if(görevGetir && KullaniciData && yetkiliBilgisi && yetkiliBilgisi.Yönetim && KullaniciData.Staff && KullaniciData.StaffGiveAdmin) {
                    await yetkiSistemi.updateOne({_id: newMember.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
                    await Users.updateOne({ _id: newMember.id }, { $push: { "StaffLogs": {
                        Date: Date.now(),
                        Process: "GÜNCELLEME",
                        Role: role.id,
                        Author: entry.executor.id
                      }}}, { upsert: true }) 
                }
                
                      await Users.updateOne({_id: newMember.id},  { $push: { "Roles": { rol: role.id, mod: entry.executor.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true })
                let logChannel = newMember.guild.kanalBul("rol-ver-log")
                if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${entry.executor} yetkilisi, ${newMember} kişisine ${tarihsel(Date.now())} tarihinde <@&${role.id}> rolünü verdi.`)]})      
            }
        }}
    )

    oldMember.roles.cache.forEach(async (role) => {
        if(!oldMember.roles.cache.has(role.id)) {
            if(_staffs.staffs.some(x => role.id == x.rol) && roller.altilkyetki != role.id && roller.altilkyetki != role.id) {
                let guild = newMember.guild
                if(!guild) return;
                let added = guild.members.cache.get(entry.executor.id)
                if(added) added.send({content: `Merhaba ${added}! ${newMember} kişisine, el ile yetkili rol verdiğin için kişinin @${role.name} rolü alındı,yetkili rol vermek için \`.yetkili ${newMember}\` komutunu kullan.`}).catch(err => {})
            } else {
                let görevGetir = await Tasks.findOne({ roleID: role.id }) || await Tasks.findOne({ roleID: role.id })
                let KullaniciData = await Users.findOne({_id: newMember.id})
                let yetkiliBilgisi = await yetkiSistemi.findOne({_id: newMember.id})
                if(görevGetir && yetkiliBilgisi)  {
                    await yetkiSistemi.deleteOne({_id: newMember.id});
                    await Users.updateOne({ _id: newMember.id }, { $set: { "Staff": false } }, { upsert: true })
                    await Users.updateOne({ _id: newMember.id }, { $push: { "StaffLogs": {
                        Date: Date.now(),
                        Process: "ALINDI",
                        Role: role.id,
                        Author: entry.executor.id
                      }}}, { upsert: true }) 
                }
                await Users.updateOne({_id: newMember.id},  { $push: { "Roles": { rol: role.id, mod: entry.executor.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true })
                let logChannel = newMember.guild._channel("rol-al-log")
                if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${entry.executor} yetkilisi, ${newMember} kişisinden ${tarihsel(Date.now())} tarihinde <@&${role.id}> rolünü aldı.`)]})      
            }
        }
    })
}
    /* 
 let _staffs = require("../../../../source/Plugins/Staff/Sources/Global.Staff.Settings")
    const entry = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || entry.executor.bot || entry.createdTimestamp < (Date.now() - 5000)) return;  
    let yapan = newRole.guild.members.cache.get(entry.executor.id)
    if(!yapan) return;
    let Database = await GUILD_SETTINGS.findOne({guildID: newMember.guild.id})
    roller = Database.Ayarlar
    ayarlar = Database.Ayarlar
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    i
}
*/

module.exports.config = {
    Event: "guildMemberUpdate"
}