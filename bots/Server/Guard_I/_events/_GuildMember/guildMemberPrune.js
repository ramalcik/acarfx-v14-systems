const { GuildMember, EmbedBuilder, Message, AuditLogEvent } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: member.guild.id})
    if(Data && !Data.pruneGuard) return;
    let embed = new genEmbed()
    .setTitle("Sunucuda Üye Çıkar Atıldı!")
    let entry = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberPrune}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 || await client.checkMember(entry.executor.id, undefined, "Sunucudan Üye Çıkartma!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${member} (\`${member.id}\`) üyesi, ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucuda üye çıkartıldı! atan kişi ise yasaklandı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Üye Çıkartma!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "guildMemberRemove"
}
