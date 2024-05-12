const { GuildMember, EmbedBuilder, GuildChannel, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const { ChannelType } = require("discord.js");
 /**
 * @param {GuildChannel} channel
 */


module.exports = async (channel) => {
  const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
  let Data = await Guard.findOne({guildID: channel.guild.id})
  if(Data && !Data.channelGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Kanal Silindi!")
    let entry = await channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelDelete}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "channels" ,"Kanal Silme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    let newChannel;
      if (channel.type === ChannelType.GuildVoice) {
        newChannel = await channel.guild.channels.create({
          name: channel.name,
          type: channel.type,
          topic: channel.topic,
          nsfw: channel.nsfw,
          parent: channel.parent,
          position: channel.position + 1,
          rateLimitPerUser: channel.rateLimitPerUser
        });
      }
      if (channel.type === ChannelType.GuildVoice) {
        newChannel = await channel.guild.channels.create({
          name: channel.name,
          type: channel.type,
          bitrate: channel.bitrate,
          userLimit: channel.userLimit,
          parent: channel.parent,
          position: channel.position + 1
        });
      }
      if (channel.type === ChannelType.GuildCategory) {
        newChannel = await channel.guild.channels.create({
          name: channel.name,
          type: channel.type,
          position: channel.position + 1
        });
        const textChannels = await TextChannels.find({ parentID: channel.id });
        await TextChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
        textChannels.forEach(c => {
          const textChannel = channel.guild.channels.cache.get(c.channelID);
          if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
        });
        const voiceChannels = await VoiceChannels.find({ parentID: channel.id });
        await VoiceChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
        voiceChannels.forEach(c => {
          const voiceChannel = channel.guild.channels.cache.get(c.channelID);
          if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
        });
      };
      channel.permissionOverwrites.cache.forEach(perm => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        newChannel.permissionOverwrites.create(perm.id, thisPermOverwrites);
      });
      await client.queryManage(channel.id, newChannel.id)
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal silindi ve geri oluşturularak yapan kişi yasaklandı.`);
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
      type: "Kanal Silme!",
      target: entry.executor.id,
  })
}

module.exports.config = {
    Event: "channelDelete"
}
