const { GuildMember, EmbedBuilder, Message, Guild, GuildChannel, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: channel.guild.id})
    if(Data && !Data.webhookGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Webhook Güncellendi!")
    let entry = await channel.guild.fetchAuditLogs({type: AuditLogEvent.WebhookUpdate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, undefined ,"Webhook Güncelleme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    const webhook = entry.target;
    await webhook.edit({ name: webhook.name, avatar: webhook.avatar, channel: webhook.channelID });
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` kanalında webhook güncellendi ve güncellendiği gibi cezalandırıldı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Webhook Güncellendi!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "webhookUpdate"
}
