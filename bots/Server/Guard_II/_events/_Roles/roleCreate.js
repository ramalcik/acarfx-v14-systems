const { EmbedBuilder , Guild, AuditLogEvent} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

/**
 * 
 * @param {Guild} role 
 * @returns 
 * 
 */

module.exports = async role => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: role.guild.id})
    if(Data && !Data.roleGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Rol Oluşturuldu!")
    let entry = await role.guild.fetchAuditLogs({type: AuditLogEvent.RoleCreate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "roles" ,"Rol Oluşturma!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (__${entry.executor.id}__) tarafından bir rol oluşturuldu! Oluşturan kişi yasaklandı ve rol silindi.`);
    await role.delete()
    let loged = role.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await role.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Rol Oluşturdu!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "roleCreate"
}


