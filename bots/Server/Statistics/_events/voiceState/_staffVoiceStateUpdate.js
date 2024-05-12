const { ChannelType } = require('discord.js');

let Upstaff;
module.exports = () => {
    Upstaff = require('../../../../Global/Plugins/Staff/_index');
    client.logger.log("Yetki sistemi verileri güncellendi.","ups")
    let guild = client.guilds.cache.get(sistem.SERVER.ID);
    setInterval( async () => {
        let channels = guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice && channel.members.size > 0 && channel.parent && _statSystem.accessPointChannels.includes(channel.parentId));
        channels.forEach(channel => {
            let members = channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf && _statSystem.staffs.some(x => member.roles.cache.has(x.rol)));
            members.forEach(async (member) => {
                if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || member.roles.cache.has(roller.underworldRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
                if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
                    await client.Upstaffs.addPoint(member.id, _statSystem.points.halfVoice, "Ses", channel.id)
                    return;
                }

                if(_statSystem.fullPointChannels.includes(channel.parentId)) {
                    if(member.voice.selfMute) { await Upstaff.addPoint(member.id, _statSystem.points.halfVoice, "Ses", channel.parentId) 
                        } else { await client.Upstaffs.addPoint(member.id, _statSystem.points.voice, "Ses", channel.parentId) }
                    } 
                else { await Upstaff.addPoint(member.id, _statSystem.points.halfVoice, "Ses", channel.parentId) }
            });
        });
    }, 600000);
}

module.exports.config = {
    Event: "ready"
}