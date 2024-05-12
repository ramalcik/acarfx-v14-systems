const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = async (oldState, newState) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: oldState.guild.id})
    if(Data && !Data.disconnectGuard) return;
    let embed = new genEmbed().setTitle("Sunucuda Bağlantı Kesildi!")
    let kanalcık = newState.channel
    
    if(ayarlar && ayarlar.özelOda) {
        let guild = newState.guild 
        if(guild) {
            let olur = guild.channels.cache.get(kanallar.registerKategorisi)
            if(olur && kanalcık && (kanalcık.parentId == olur.id  || kanalcık.parentId == kanallar.streamerKategorisi || kanalcık.parentId == kanallar.sorunCozmeKategorisi)) return;
            let kanalgetir = guild.channels.cache.get(kanallar.özelOdaOluştur)
            if(kanalgetir && kanalcık && kanalgetir.id && kanalcık.parentId == kanalgetir.id) return;
        }
    } 
    if (kanalcık === null) {
        let entry = await (oldState, newState).guild.fetchAuditLogs({type: AuditLogEvent.MemberDisconnect}).then(audit => audit.entries.first());
        if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sunucuda Bağlantı Kesme!")) return;
            client.punitivesAdd(entry.executor.id, "jail")
            //client.allPermissionClose()
            embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından ${oldState.member} üyesinin bağlantısı kesildi. Bu işlemi yapan kişi sunucudan cezalandırıldı.`);
            let loged = oldState.guild.kanalBul("guard-log");
            if(loged) await loged.send({embeds: [embed]});
            const owner = await oldState.guild.fetchOwner();
            if(owner) owner.send({embeds: [embed]}).catch(err => {})
            client.processGuard({
                type: "Sağ-tık Bağlantı Kesme!",
                target: oldState.member.id,
                member: entry.executor.id,
            })
    }
}

module.exports.config = {
    Event: "voiceStateUpdate"
}

client.on("voiceChannelMute", async (member, muteType) => {
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: member.guild.id})
    if(Data && !Data.muteGuard) return;
    let embed = new genEmbed()
    let entry = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate
    }).then(audit => audit.entries.first());
    let checkRegister = member.guild.channels.cache.get(member.voice.channelId)
    if(entry && entry.executor && !entry.executor.bot && checkRegister && checkRegister.parentId) {
        if(checkRegister.parentId == kanallar.registerKategorisi || checkRegister.parentId == kanallar.streamerKategorisi || checkRegister.parentId == kanallar.sorunCozmeKategorisi) {
            embed.setDescription(`${member} (__${member.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından ${checkRegister} kanalında Sağ-tık susturma işlemi yapıldı!`);
            let muted = member.guild.kanalBul("sesmute-log");
            if(muted) return muted.send({embeds: [embed]});
        }
    }
    let kanalcık = member.guild.channels.cache.get(member.voice.channelId)
    if(ayarlar && ayarlar.özelOda) {
        let guild = member.guild 
        if(guild) {
            let kanalgetir = guild.channels.cache.get(kanallar.özelOdaOluştur)
            if(kanalgetir && kanalcık && kanalgetir.id && kanalcık.parentId == kanalgetir.id) return;
        }
    } 

    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Susturma İşlemi!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    //client.allPermissionClose()
    embed.setDescription(`${member} (__${member.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından Sağ-tık susturma işlemi yapıldı! yapan kişi ise cezalandırıldı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await member.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
        type: "Sağ-tık Susturma!",
        target: member.id,
        member: entry.executor.id,
    })
});
