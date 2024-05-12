const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const { genEmbed } = require("../../../../Global/Init/Embed");
const Roles = require('../../../../Global/Databases/Schemas/Guards/GuildMember.Roles.Backup');
const leftRoles = require('../../../../Global/Databases/Schemas/Users.Left.Roles');
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { AuditLogEvent } = require('discord.js');

/**
* @param {Client} client 
*/

module.exports = async (member) => {
 if(member.guild.id !== sistem.SERVER.ID) return;
 let kanalBul = member.guild.kanalBul("ayrılanlar")
 if(kanalBul) kanalBul.send({content: `${member}`, embeds: [new genEmbed().setDescription(`${member} (\`${member.id}\`) üyesi sunucudan <t:${String(Date.now()).slice(0, 10)}:R> (<t:${String(Date.now()).slice(0, 10)}:F>) ayrıldı.`)]})
 if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.underworldRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
 member.Left()
}

module.exports.config = {
   Event: "guildMemberRemove"
};

client.on("guildMemberRemove", async (member) => {
 if(member.guild.id !== sistem.SERVER.ID) return;
 await Roles.deleteOne({_id: member.id})
 let detay = client.users.cache.get(member.id)

 await GUILD_SETTINGS.updateOne({guildID: member.guild.id}, {$set: {[`Caches.latest`]: {
   id: detay.id,
   avatarURL: detay.displayAvatarURL({extension: 'png'}),
   tag: detay.tag
 }}}, {upsert: true})

 let yetkiliRol = member.guild.roles.cache.get(roller.altilkyetki);
 let uyeUstRol = member.guild.roles.cache.get(member.roles.highest.id)
 if(yetkiliRol.rawPosition < uyeUstRol.rawPosition) {
  let rolleri = []
  member.roles.cache.filter(x => x.name != "@everyone").map(x => rolleri.push(x.id))
  await leftRoles.updateOne({_id: member.id} , {$set: {"_roles": rolleri}}, {upsert: true});
 }
})

client.on("guildMemberRemove", async (member) => {
 if(member.guild.id !== sistem.SERVER.ID) return;
 let entry = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberKick}).then(audit => audit.entries.first());
 if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000) return
 await Users.updateOne({ _id: entry.executor.id } , { $inc: { "Uses.Kick": 1 } }, { upsert: true })
})