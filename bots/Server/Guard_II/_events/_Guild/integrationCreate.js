const { EmbedBuilder, Guild, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Guild} guild
 */


module.exports = async (guild) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: guild.id})
    if(Data && !Data.botGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Entegrasyon Oluşturuldu!")
    let entry = await guild.fetchAuditLogs({type: AuditLogEvent.IntegrationCreate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, undefined ,"Entegrasyon Oluşturuldu!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından entegrasyonları oluşturuldu ve oluşturulduğu gibi cezalandırıldı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Entegrasyon Oluşturdu!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "guildIntegrationsUpdate"
}
