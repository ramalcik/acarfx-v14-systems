const { GuildMember, EmbedBuilder, Message, Guild, AuditLogEvent } = require("discord.js");
const request = require('request');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Guild} oldGuild
 * @param {Guild} newGuild
 */


module.exports = async (oldGuild, newGuild) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: oldGuild.id})
    if(Data && !Data.guildGuard) return;
    let embed = new genEmbed().setTitle("Sunucu Ayarları Güncellendi!")
    let entry = await newGuild.fetchAuditLogs({type: AuditLogEvent.GuildUpdate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "guild" ,"Sunucu Ayarları Güncelleme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    if (newGuild.name !== oldGuild.name) await newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({extension: 'png', size: 2048}) !== oldGuild.iconURL({extension: 'png', size: 2048})) await newGuild.setIcon(oldGuild.iconURL({extension: 'png', size: 2048}));
    if (oldGuild.banner !== newGuild.banner) await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
    if (newGuild.vanityURLCode && (newGuild.vanityURLCode !== oldGuild.vanityURLCode)) {
        request({method: "PATCH", url: `https://discord.com/api/guilds/${newGuild.id}/vanity-url`,
            headers: { "Authorization": `Bot ${client.token}` },
            json: { "code": oldGuild.vanityURLCode }
        });
    }
    embed.setDescription(` ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan sunucu güncellendi! Güncelleyen kişi banlandı ve sunucu eski haline getirildi.`);
    let loged = newGuild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await newGuild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Sunucu Güncelledi!",
        target: entry.executor.id,
    })
}

module.exports.config = {
    Event: "guildUpdate"
}
