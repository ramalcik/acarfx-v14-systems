const { GuildMember, Collection } = require('discord.js');
const GUILD_INVITE = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
let Upstaff
/**
 * 
 * @param {GuildMember} member 
 */

module.exports = async (member) => {
    Upstaff = require('../../../../Global/Plugins/Staff/_index');
    if(member.guild.id != sistem.SERVER.ID) return;

    const _findServer = await GUILD_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = global._set = _findServer.Ayarlar
    
    const channel = client.channels.cache.get(_set.davetKanalı);
    if (!channel) return;
   if (member.user.bot) return channel.send({ content: `${member.guild.emojiGöster(emojiler.Iptal)} **${member.user.username}** üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı!` })
    const inviteMemberData = await GUILD_INVITE.findOne({ userID: member.user.id }) || [];
    if (!inviteMemberData.Inviter) {
      return channel.send({ content: `${member.guild.emojiGöster(emojiler.Iptal)} **${member.user.username}** üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı!` });
    } else if (inviteMemberData.Inviter === member.guild.id) {
      await GUILD_INVITE.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: -1 } }, { upsert: true });
      const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: member.guild.id });
      const total = inviterData ? inviterData.total : 0;
      return channel.send({ content: `${member.guild.emojiGöster(emojiler.Iptal)} **${member.user.username}** üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı!` });
    } else {
      if (Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7) {
        const inviter = await client.users.fetch(inviteMemberData.Inviter);
        const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: inviter.id, });
        const total = inviterData ? inviterData.total : 0;  
        return channel.send({ content: `${member.guild.emojiGöster(emojiler.Iptal)} **${member.user.username}** üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı! Sunucumuza **${inviter.tag}** üyesi tarafından davet edilmiş. ${total > 0 ? `**(**Toplam Davet: \`${total}\`**)**` : "" }` })
      } else {
        let inviteOwn = member.guild.members.cache.get(inviteMemberData.Inviter);
        const inviter = await client.users.fetch(inviteMemberData.Inviter);
        const ivSync = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: inviter.id, });
        if (ivSync && ivSync.total-1 >= 0) await GUILD_INVITE.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id}, { $inc: { leave: 1, total: -1 } }, { upsert: true });
        const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: inviter.id, });
        const total = inviterData ? inviterData.total : 0; 
        if(inviteOwn && _statSystem.system) Upstaff.removePoint(inviteOwn.id, -_statSystem.points.invite, "Invite")
        return channel.send({ content: `${member.guild.emojiGöster(emojiler.Iptal)} **${member.user.username}** üyesi sunucumuzdan <t:${Number(String(Date.now()).substring(0, 10))}:R> ayrıldı! Sunucumuza **${inviter.tag}** üyesi tarafından davet edilmiş. ${total > 0 ? `**(**Toplam Davet: \`${total}\`**)**` : "" }` });
      }
    }
}

module.exports.config = {
    Event: "guildMemberRemove"
}

