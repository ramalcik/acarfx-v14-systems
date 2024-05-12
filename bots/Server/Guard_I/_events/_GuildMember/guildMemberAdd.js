const { EmbedBuilder, GuildMember, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: member.guild.id})
    if(Data && !Data.botGuard) return;
    let embed = new genEmbed().setTitle("Sunucuya Bot Eklendi!")
    let entry = await member.guild.fetchAuditLogs({type: AuditLogEvent.BotAdd}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "bot" ,"Sunucuya Bot Ekleme!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.punitivesAdd(member.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) isimli üye tarafından ${member} (\`${member.id}\`) adında bir bot ekledi ve eklenen bot ile ekleyen üye cezalandırıldı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await member.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Bot Ekleme!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "guildMemberAdd"
}
