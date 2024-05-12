const { GuildMember, EmbedBuilder, Message, Guild, GuildEmoji, AuditLogEvent } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildEmoji} emoji
 */


module.exports = async (emoji) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: emoji.guild.id})
    if(Data && !Data.emojiGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Emoji Oluşturuldu!")
    let entry = await emoji.guild.fetchAuditLogs({type: AuditLogEvent.EmojiCreate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "emoji" ,"Emoji Oluşturma!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${emoji.name}\` isimli emoji oluşturuldu ve oluşturulduğu gibi silinip cezalandırıldı.`);
    await emoji.delete()
    let loged = emoji.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await emoji.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Emoji Oluşturdu!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "emojiCreate"
}
