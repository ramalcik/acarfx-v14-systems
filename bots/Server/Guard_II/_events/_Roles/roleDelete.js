const { EmbedBuilder , Guild, AuditLogEvent} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const deletedRoles = require('../../../../Global/Databases/Schemas/Guards/Backup/Guild.Deleted.Roles');
/**
 * @param {Guild} role 
 */

module.exports = async role => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: role.guild.id})
    if(Data && !Data.roleGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Rol Silindi!")
    let entry = await role.guild.fetchAuditLogs({type: AuditLogEvent.RoleDelete}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000) return;
    await deletedRoles.updateOne({"roleID": role.id}, { $set: { "Date": Date.now(), "Remover": entry.executor.id }}, {upsert: true})
    embed.setDescription(`${entry.executor} (__${entry.executor.id}__) tarafından ${role.name} (__${role.id}__) rolü silindi. \`${sistem.botSettings.Prefixs[0]}rolkur ${role.id}\` komutu ile kurulum yapabilirsiniz.`);
    let loged = role.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await role.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "roleDelete"
}