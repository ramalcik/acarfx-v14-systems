const { EmbedBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
let { AuditLogEvent } = require("discord.js")
module.exports = async channel => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: channel.guild.id})
    if(Data && !Data.channelGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Kanal Oluşturuldu!")
    let entry = await channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelCreate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "channels" ,"Kanal Oluşturma!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal oluşturuldu ve oluşturulduğu gibi silinip yapan kişi yasaklandı.`);
    await channel.delete({reason: `Guard tarafından tekrardan silindi.`});   
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Kanal Oluşturma!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "channelCreate"
}
