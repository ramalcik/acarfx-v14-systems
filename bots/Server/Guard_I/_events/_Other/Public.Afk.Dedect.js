const { VoiceState } = require("discord.js");
const voiceAfks = new Map();
const streamerAfks = new Map();
const ms = require('ms');
const sure = "10m"
const streamersure = "15m"
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { ChannelType } = require("discord.js");

client.on("voiceStateUpdate", async (oldState, newState) => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = _findServer.Ayarlar
    let ayar = ayarlar.otomatikSleep || false
    if(!ayar) return;
    let member = oldState.member;
    if(!member) return;
    if(member.user.bot) return;
    if(!ayarlar) return;
    if(!kanallar.streamerKategorisi) return;
    if(!newState.channelId) return await streamerAfks.delete(member.id)
    if(oldState.channelId && !newState.channelId) {
        if(streamerAfks.get(member.id)) return await streamerAfks.delete(member.id)
    }
    if(member.guild.channels.cache.get(newState.channelId).parentId != kanallar.streamerKategorisi) return;
    if(member.voice.selfDeaf && member.voice.selfMute) {
             streamerAfks.set(member.id, { channel: newState.channelId, date: Date.now()+ms(streamersure) })
        } else {
            await streamerAfks.delete(member.id)
    } 

})

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */

module.exports = async (oldState, newState) => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = _findServer.Ayarlar
    let ayar = ayarlar.otomatikSleep || false
    if(!ayar) return;
    let member = oldState.member;
    if(!member) return;
    if(member.user.bot) return;
    if(!ayarlar) return;
    if(!kanallar.sleepRoom) return;
    if(!kanallar.publicKategorisi) return;
    if(!newState.channelId) return await voiceAfks.delete(member.id)
    if(oldState.channelId && !newState.channelId) {
        if(voiceAfks.get(member.id)) return await voiceAfks.delete(member.id)
    }
    if(member.guild.channels.cache.get(newState.channelId).parentId != kanallar.publicKategorisi) return;
    if(kanallar.musicRooms.some(x => x == newState.channelId)) {
        if(voiceAfks.get(member.id)) return await voiceAfks.delete(member.id)
        return;
    };
    if(member.voice.selfDeaf || member.voice.selfMute) {
             voiceAfks.set(member.id, { channel: newState.channelId, date: Date.now()+ms(sure) })
        } else {
            await voiceAfks.delete(member.id)
    } 

}

module.exports.config = {
    Event: "voiceStateUpdate"
}


client.on("ready", async () => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = _findServer.Ayarlar
    let ayar = ayarlar.otomatikSleep || false
    if(!ayar) return;
    let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
    if(!guild) return;
    if(!ayarlar) return;
    if(!kanallar.sleepRoom) return;
    if(!kanallar.publicKategorisi) return;
    if(!kanallar.streamerKategorisi) return;
    guild.channels.cache.filter(e => 
        e.type == ChannelType.GuildVoice && 
        e.members.size > 0 &&
        e.parentId == kanallar.streamerKategorisi).forEach(channel => {
        channel.members.filter(member => !member.user.bot && member.voice.selfDeaf && member.voice.selfMute).forEach(async (member) => {
            if(!streamerAfks.get(member.id)) return streamerAfks.set(member.id, { channel: channel.id, date: Date.now()+ms(streamersure) });
        })
    }) 
    guild.channels.cache.filter(e => 
        e.type == ChannelType.GuildVoice && 
        e.members.size > 0 &&
        e.parentId == kanallar.publicKategorisi &&
        e.id != kanallar.sleepRoom &&
        kanallar.musicRooms.some(x => e.id != x)).forEach(channel => {
        channel.members.filter(member => !member.user.bot && (member.voice.selfDeaf || member.voice.selfMute)).forEach(async (member) => {
        
            if(!voiceAfks.get(member.id)) return voiceAfks.set(member.id, { channel: channel.id, date: Date.now()+ms(sure) });
        })
    }) 

    setInterval(() => {
        checkAfk()
        checkStreamer()
    }, 20000);
});


async function checkStreamer() {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = _findServer.Ayarlar
    let ayar = ayarlar.otomatikSleep || false
    if(!ayar) return;
    let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
    if(!guild) return;
    if(!ayarlar) return;
    if(!kanallar.sleepRoom) return;
    if(!kanallar.streamerKategorisi) return;
    guild.channels.cache.filter(e => 
        e.type == ChannelType.GuildVoice && 
        e.members.size > 0 &&
        e.parentId == kanallar.streamerKategorisi).forEach(channel => {
        channel.members.filter(member => !member.user.bot && streamerAfks.get(member.id)).forEach(async (member) => {
                let data = streamerAfks.get(member.id);
                    if(data && Date.now() >= data.date) {
                        await streamerAfks.delete(member.id);
                        if(member) member.send({content: `**${channel.name}** sohbet kanalında afk olduğunu fark ettik.
Seni otomatik olarak "**${member.guild.channels.cache.get(kanallar.sleepRoom).name}**" kanalına gönderdim.`}).catch(err => {})
                        if(member && member.voice.channel) return member.voice.setChannel(kanallar.sleepRoom).catch(err => {})
                    }
        })
    }) 
}

async function checkAfk() {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = _findServer.Ayarlar
    let ayar = ayarlar.otomatikSleep || false
    if(!ayar) return;
    let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
    if(!guild) return;
    if(!ayarlar) return;
    if(!kanallar.sleepRoom) return;
    if(!kanallar.publicKategorisi) return;
    guild.channels.cache.filter(e => 
        e.type == ChannelType.GuildVoice && 
        e.members.size > 0 &&
        e.parentId == kanallar.publicKategorisi &&
        e.id != kanallar.sleepRoom &&
        kanallar.musicRooms.some(x => e.id != x)).forEach(channel => {
        channel.members.filter(member => !member.user.bot && voiceAfks.get(member.id)).forEach(async (member) => {
                let data = voiceAfks.get(member.id);
                    if(data && Date.now() >= data.date) {
                        await voiceAfks.delete(member.id);
                        if(member) member.send({content: `**${channel.name}** sohbet kanalında afk olduğunu fark ettik.
Seni otomatik olarak "**${member.guild.channels.cache.get(kanallar.sleepRoom).name}**" kanalına gönderdim.`}).catch(err => {})
                        if(member && member.voice.channel) return member.voice.setChannel(kanallar.sleepRoom).catch(err => {})
                    }
        })
    }) 
}


