const { GuildMember, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const ms = require('ms')
const dataLimit = new Map()
 /**
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */

module.exports = async (oldMember, newMember) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: oldMember.guild.id})
    if(Data && !Data.memberRoleGuard) return;
    const permissionStaff = [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageWebhooks
      ];
    let embed = new genEmbed()
    .setTitle("Sunucuda Sağ-Tık Rol Verildi/Alındı!")
    if (newMember.roles.cache.size > oldMember.roles.cache.size) {
    let entry = await newMember.guild.fetchAuditLogs({type: AuditLogEvent.MemberRoleUpdate}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Rol/Ver Alma!")) return;
        if (permissionStaff.some(p => oldMember.permissions.has(p) && newMember.permissions.has(p))) {
       
                await newMember.roles.set(oldMember.roles.cache.map(r => r.id))  
                embed.setDescription(`${newMember} (__${newMember.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından Sağtık Rol İşlemi Yapıldı! Veren kişi cezalandırıldı ve verilen kişiden rol geri alındı.`);
                let loged = newMember.guild.kanalBul("guard-log");
                if(loged) await loged.send({embeds: [embed]});
                await client.punitivesAdd(entry.executor.id, "jail")
                const owner = await newMember.guild.fetchOwner();
                if(owner) owner.send({embeds: [embed]}).catch(err => {})
                client.processGuard({
                    type: "Sağ-tık Rol Verme/Alma!",
                    target: entry.executor.id,
                    member: newMember.id,
                })
            
        }
    };
}

module.exports.config = {
    Event: "guildMemberUpdate"
}


client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: member.guild.id})
    if(Data && !Data.nicknameGuard) return;
    let embed = new genEmbed()
    let entry = await member.guild.fetchAuditLogs({
        limit: 1,
        type: "GUILD_MEMBER_UPDATE"
    }).then(audit => audit.entries.first());
    if(entry && entry.executor && entry.executor.bot) return;
    if(entry && entry.executor && !entry.executor.bot) {
        if(await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık İsim Değiştirme!")) {
            await Users.updateOne({_id: member.id}, {$push: { "Names": { Staff: entry.executor.id, Name: newNickname == null ? member.user.username : newNickname, State: "Sağ-Tık Değiştirme", Date: Date.now() }}}, {upsert: true})
            let Log = member.guild.kanalBul("isim-log")
            if(Log) Log.send({embeds: [embed.setDescription(`${member} (__${member.id}__) üyesinin ismi \`${oldNickname == null ? member.user.username : oldNickname} => ${newNickname == null ? member.user.username : newNickname}\` olarak ${entry.executor} (__${entry.executor.id}__) tarafından **${tarihsel(Date.now())}** güncellendi.`)]})
        }
    }
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık İsim Değiştirme!")) return;
    member.setNickname(oldNickname).catch(err => {})
    // client.punitivesAdd(entry.executor.id, "jail")
    embed.setDescription(`${member} (__${member.id}__) üyesinin ismi \`${oldNickname == null ? member.user.username : oldNickname} => ${newNickname == null ? member.user.username : newNickname}\` olarak ${entry.executor} (__${entry.executor.id}__) tarafından izinsiz olarak güncellendi ve ${member} üyesinin ismi eski haline getirildi.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await member.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "İzinsiz İsim Değiştirme!",
        target: entry.executor.id,
        member: member.id,
    })
})
