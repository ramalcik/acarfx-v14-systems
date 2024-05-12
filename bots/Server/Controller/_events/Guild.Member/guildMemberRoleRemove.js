const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
let _staffs
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs')
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks')
module.exports = async (member, role) => {
    var reload = require('require-reload')(require);
    _staffs = reload('../../../../Global/Plugins/Staff/Sources/_settings.js');
    const entry = await member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || entry.executor.bot || entry.createdTimestamp < (Date.now() - 5000)) return;
    if(_staffs.staffs.some(x => role.id == x.rol) && roller.altilkyetki != role.id && roller.başlangıçYetki != role.id) {
        let guild = member.guild
        if(!guild) return;
        await member.roles.add(role.id, "Sağ-tık yetki çekildiğinden dolayı tekrar verildi.").catch(err => {})
        let added = guild.members.cache.get(entry.executor.id)
        if(added) added.send({content: `Yetki vermek istediğin ${member} isimli üyeye Sağ-tık ile yetki alamazsın.
Almak istediğin **@${role.name}** rolü sadece komut üzerinden verilmeye ve alınmaya açıktır.
Lütfen websitesi veya komut üzerinden tekrardan verebilir veya da alabilirsiniz. ${guild.emojiGöster(emojiler.Iptal)}`}).catch(err => {})
    } else {
        let görevGetir = await Tasks.findOne({ roleID: role.id }) || await Tasks.findOne({ roleID: role.id })
        let KullaniciData = await Users.findOne({_id: member.id})
        let yetkiliBilgisi = await Upstaffs.findOne({_id: member.id})
        if(görevGetir && yetkiliBilgisi)  {
            await Upstaffs.deleteOne({_id: member.id});
            await Users.updateOne({ _id: member.id }, { $set: { "Staff": false } }, { upsert: true })
            await Users.updateOne({ _id: member.id }, { $push: { "StaffLogs": {
                Date: Date.now(),
                Process: "ÇEKİLDİ",
                Role: member.roles.hoist ? member.roles.hoist.id : roller.başlangıçYetki,
                Author: entry.executor.id
              }}}, { upsert: true }) 
        }
        await Users.updateOne({_id: member.id},  { $push: { "Roles": { rol: role.id, mod: entry.executor.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true })
        let logChannel = member.guild.kanalBul("rol-al-log")
        if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${member} isimli üyeden <t:${String(Date.now()).slice(0, 10)}:R> ${entry.executor} tarafından ${role} adlı rol geri alındı.`)]})    
    }
}

module.exports.config = {
    Event: "guildMemberRoleRemove"
}