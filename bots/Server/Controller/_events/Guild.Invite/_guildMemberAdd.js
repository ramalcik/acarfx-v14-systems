const { GuildMember, Collection, AuditLogEvent } = require('discord.js');
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
    let entry = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd }).then(audit => audit.entries.first());
    if (member.user.bot && entry) return channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} isimli bot, **${entry.executor.tag}** tarafından \`${member.guild.name}\` sunucusuna davet edildi.` })
    const guildInvites = client.invites.get(member.guild.id) || new Collection()
    const invites = await member.guild.invites.fetch();
    const invite = invites.find((inv) => guildInvites.has(inv.code) && inv.uses > guildInvites.get(inv.code).uses) || guildInvites.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
    const cacheInvites = new Collection();
    invites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); });
    client.invites.set(member.guild.id, cacheInvites);
    if (invite === null) {
      channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi sunucumuza <t:${Number(String(Date.now()).substring(0, 10))}:R> katıldı!` })
    } else if (invite === undefined) {
      channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi sunucumuza <t:${Number(String(Date.now()).substring(0, 10))}:R> katıldı!` })
    } else if (!invite) {
      channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi sunucumuza <t:${Number(String(Date.now()).substring(0, 10))}:R> katıldı!` })
    } else if (invite === member.guild.vanityURLCode) {
      await GUILD_INVITE.findOneAndUpdate({ userID: member.user.id }, { $set: { Inviter: member.guild.id } }, { upsert: true });
      await GUILD_INVITE.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: 1 } }, { upsert: true });
      const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: member.guild.id });
      const total = inviterData ? inviterData.total : 0;
      return channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi sunucumuza **Özel URL** kullanarak <t:${Number(String(Date.now()).substring(0, 10))}:R> katıldı!` });
    } else {
      let inviteOwn = member.guild.members.cache.get(invite.inviter.id);
      await GUILD_INVITE.findOneAndUpdate({ userID: member.user.id }, { $set: { Inviter: invite.inviter.id } }, { upsert: true });
      if (Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7) {
        await GUILD_INVITE.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { fake: 1, regular: 1 } }, { upsert: true });
        const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
        const total = inviterData ? inviterData.total : 0;
        channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi **${invite.inviter.tag}** tarafından <t:${Number(String(Date.now()).substring(0, 10))}:R> sunucumuza davet edildi. ${total > 0 ? `**(**Toplam Davet: \`${total}\`**)**` : "" }` });
      } else {
        await GUILD_INVITE.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
        const inviterData = await GUILD_INVITE.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
        const total = inviterData ? inviterData.total : 0;
        if(inviteOwn) await Upstaff.addPoint(inviteOwn.id, _statSystem.points.invite, "Invite") 
        if(inviteOwn) inviteOwn.Leaders("davet", _statSystem.points.invite, {type: "INVITE", user: member.id}), inviteOwn.Leaders("invite", _statSystem.points.invite, {type: "INVITE", user: member.id})  
        channel.send({ content: `${member.guild.emojiGöster(emojiler.Onay)} ${member} üyesi **${invite.inviter.tag}** tarafından <t:${Number(String(Date.now()).substring(0, 10))}:R> sunucumuza davet edildi. ${total > 0 ? `**(**Toplam Davet: \`${total}\`**)**` : "" }` });
      }
    }
}

module.exports.config = {
    Event: "guildMemberAdd"
}