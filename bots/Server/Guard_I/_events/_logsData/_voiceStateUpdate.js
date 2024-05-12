const { VoiceState, EmbedBuilder, AuditLogEvent } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
 /**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState 
 */


 module.exports = async (oldState, newState) => {
        let logKanali = newState.guild.kanalBul("ses-log")
        if(!logKanali) return;
        let uye = oldState.guild.members.cache.get(oldState.member.id) || newState.guild.members.cache.get(newState.member.id)
        if(!uye) return;
        if (!oldState.channelId && newState.channelId) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "KATILDI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı sesli kanala **katıldı!**`)]}).catch();
        }
        if (oldState.channelId && !newState.channelId) {
            await Users.updateOne({_id: oldState.id}, {$push: {"Voices": {
                channel: oldState.channelId,
                date: Date.now(),
                state: "AYRILDI"
            }}}, {upsert: true})
          return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${oldState.guild.members.cache.get(oldState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** \`${oldState.guild.channels.cache.get(oldState.channelId).name}\` adlı sesli kanaldan **ayrıldı!**`)]}).catch();
        }
        if(oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            let entry = await newState.guild.fetchAuditLogs({ type: AuditLogEvent.MemberMove }).then(audit => audit.entries.first());
            if(entry &&  entry.executor.id !== newState.id && entry.executor.id !== client.user.id) {
                await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                    channel: newState.channelId,
                    date: Date.now(),
                    entry: entry.executor.id,
                    state: "TAŞINDI"
                }}}, {upsert: true})
                return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`:arrow_up_down: ${newState.member} üyesi ${newState.guild.members.cache.get(entry.executor.id)} tarafından **<t:${String(Date.now()).slice(0, 10)}:R>** ${oldState.channel} adlı ses kanalından ${newState ? newState.channel : oldState ? oldState.channel : "#kanalyok"} adlı ses kanalına **taşındı!**`)]})
            }
            if(!entry || entry.executor.id !== client.user.id) {
                await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                    channel: newState.channelId,
                    date: Date.now(),
                    state: "DEĞİŞTİ"
                }}}, {upsert: true})
                return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ses kanalını **değiştirdi!** (\`${newState.guild.channels.cache.get(oldState.channelId).name}\` => ${newState.channel})`)]}).catch();
            }
        }
        if (oldState.channelId && oldState.selfMute && !newState.selfMute) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "MİKROFON AÇILDI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı sesli kanalda kendi susturmasını **kaldırdı!**`)]}).catch();
        }
        if (oldState.channelId && !oldState.selfMute && newState.selfMute) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "MİKROFON KAPATTI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı sesli kanalda kendini **susturdu!**`)]}).catch();
        }
        if (oldState.channelId && oldState.selfDeaf && !newState.selfDeaf) {
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`)]}).catch();
        }
        if (oldState.channelId && !oldState.selfDeaf && newState.selfDeaf) {
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${newState.guild.members.cache.get(newState.id)} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı sesli kanalda kendini **sağırlaştırdı!**`)]}).catch();
        }
        if(oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "YAYIN AÇTI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`:desktop: ${newState.member} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı ses kanalında **yayın açtı!**`)]});
        }
        
        if(oldState.channelId && oldState.streaming && newState.channelId && !newState.streaming) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "YAYIN KAPATTI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`:desktop: ${newState.member} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı ses kanalında **yayını kapattı!**`)]});
        }
        if(oldState.channelId && !oldState.selfVideo && newState.channelId && newState.selfVideo) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "KAMERA AÇTI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`:desktop: ${newState.member} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı ses kanalında **kamerasını açtı!**`)]});
        } 
        if(oldState.channelId && oldState.selfVideo && newState.channelId && !newState.selfVideo) {
            await Users.updateOne({_id: newState.id}, {$push: {"Voices": {
                channel: newState.channelId,
                date: Date.now(),
                state: "KAMERA KAPATTI"
            }}}, {upsert: true})
            return logKanali.send({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`:desktop: ${newState.member} üyesi **<t:${String(Date.now()).slice(0, 10)}:R>** ${newState.channel} adlı ses kanalında **kamerasını kapattı!**`)]})
        } 
    }

module.exports.config = {
    Event: "voiceStateUpdate"
}
