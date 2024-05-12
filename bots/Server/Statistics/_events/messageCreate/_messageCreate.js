const { Message, AttachmentBuilder } = require("discord.js");
const Stats = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats");
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings') 
const veriler = new Map();
const verileriki = new Map();
const Seens = require('../../../../Global/Databases/Schemas/Guild.Users.Seens');
let tm = require('../../../../Global/Plugins/Stats/Time.Manager');
const Discord = require("discord.js")
 /**
 * @param {Message} message 
*/

client.on("messageCreate", async message => {
    if (message.author.bot || !message.guild || message.webhookID || message.channel.type != 0 || sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
    await Seens.updateOne({userID: message.author.id}, {$set: {
        "lastSeen": Date.now(),
        "lastMessage": Date.now(),
        "last": {
            type: "MESSAGE",
            date: Date.now(),
            channel: message.channel.id,
            text: message.content ? message.content : "İçerik Bulunamadı!",
        }
    }}, {upsert: true})
    Stats.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, data) => {
        let kanalID = message.channel.parentId || message.channel.id;
        if (!data) {
            let voiceMap = new Map();
            let chatMap = new Map();
            let voiceCameraMap = new Map();
            let voiceStreamingMap = new Map();
            chatMap.set(kanalID, 1);
            let newMember = new Stats({
                guildID: message.guild.id,
                userID: message.author.id,
                messageLevel: 1,
                messageXP: 0,
                voiceLevel: 1,
                voiceXP: 0,
                voiceStats: voiceMap,
                taskVoiceStats: voiceMap,
                upstaffVoiceStats: voiceMap,
                voiceCameraStats: voiceCameraMap,
                voiceStreamingStats:  voiceStreamingMap,     
                totalVoiceStats: 0,
                allVoice: {},
                allMessage:{},
                allCategory: {},
                chatStats: chatMap,
                upstaffChatStats: chatMap,
                totalChatStats: 1,
                lifeVoiceStats: voiceMap,
                lifeTotalVoiceStats: 0,
                lifeChatStats: chatMap,
                lifeTotalChatStats: 1,
            });
            newMember.save() 
            dayStatsUpdate(message.author.id, message.channel.id)
        } else {
            let lastData = data.chatStats.get(kanalID) || 0;
            let lastLifeData = data.lifeChatStats.get(kanalID) || 0;
            let lastStaffData = data.upstaffChatStats.get(kanalID) || 0;
            data.totalChatStats++;
            data.lifeTotalChatStats++;
            data.chatStats.set(kanalID, Number(lastData)+1);
            data.lifeChatStats.set(kanalID, Number(lastLifeData)+1);
            let datacikcik = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            let guildData = datacikcik.Ayarlar
            if(guildData && guildData.seviyeSistemi) await messageXP(message.author.id, message)
            if(_statSystem.system && _statSystem.staffs.some(x => message.member.roles.cache.has(x.rol))) data.upstaffChatStats.set(kanalID, Number(lastStaffData)+1);
            data.save();
            dayStatsUpdate(message.author.id, message.channel.id)
    };
  }); 
})

async function dayStatsUpdate (id, channel) {
    let days = await tm.getDay(global.sistem.SERVER.ID)
    let kanal = client.channels.cache.get(channel)
    if(kanal) {
        let uye = kanal.guild.members.cache.get(id)
        if(uye && (kanallar.chatKanalı && kanallar.chatKanalı == kanal.id)) {
            let veri = verileriki.get(id) || 0
            if (veri >= 10) { 
                uye.Leaders("chat", 0.10, {type: "MESSAGE", channel: kanal.id})
                verileriki.delete(id)
            } else {
                verileriki.set(id, veri + 1);
            }
           
        } 
     }
    await Stats.updateOne({ userID: id, guildID: global.sistem.SERVER.ID }, { $inc: { [`allMessage.${days}.${channel}`]: 1} })
     
    

  }

module.exports = async (message) => {
    if(message.content && message.content.length < 5) return;
    if(message.webhookID || message.author.bot || message.channel.type != 0 || !message.guild || sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
    
    if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
    if(message.channel.id !== kanallar.chatKanalı) return;
    if (_statSystem.staffs.some(x => message.member.roles.cache.has(x.rol))) {
        const veri = veriler.get(message.author.id);
        if (veri && (veri % 1) === 0) { 
          veriler.set(message.author.id, veri + 1);
          await client.Upstaffs.addPoint(message.author.id, _statSystem.points.message, "Mesaj")
        } else veriler.set(message.author.id, veri ? veri + 1 : 1);  
      }
}

module.exports.config = {
    Event: "messageCreate"
}


async function messageXP(id, message) {
    let msgXp = [1,2,3,4]
    await Stats.updateOne({guildID: sistem.SERVER.ID, userID: id}, {$inc: {"messageXP": msgXp[Math.floor(Math.random()*msgXp.length)]}}, {upsert: true})
    let _getStat = await Stats.findOne({guildID: sistem.SERVER.ID, userID: id})
    if(_getStat) {
      let yeniLevel = _getStat.messageLevel * 647;
      if (yeniLevel <= _getStat.messageXP) {
        
        await Stats.updateOne({guildID: sistem.SERVER.ID, userID: id}, {$inc: {"messageLevel": 1, "messageXP": 0,}}, {upsert: true})
    
        const {
            Canvas
        } = require('canvas-constructor');
        const {
            loadImage
        } = require('canvas');
        const {
            join
        } = require("path");
             const avatar = await loadImage(message.author.avatarURL({format: "jpg"}));
             const background = await loadImage(`../../Assets/img/seviye.png`);            
            let xp = `${(_getStat.messageLevel+1) * 879}`
             const image = new Canvas(740, 128)
            .printRoundedImage(background, 0, 0, 740, 128, 25)
             .printRoundedImage(avatar, 621, 12, 105.5, 105.5, 10)
             .setTextFont('14px Arial Black')
             .setColor("#fff")
             .printText(`+${2500*(_getStat.messageLevel+1)} ${ayarlar.serverName} Parası`, 350, 70, 350)
             .setTextFont('14px Arial Black')
             .setColor("#fff")
             .printText(`+1 Değerli Altın`, 350, 105, 350)
            if(xp.toString().length > 4) { 
                image.setTextFont('16px Arial Black')
                image.setColor("#fff")
                image.printText(`${xp} XP`, 112, 115,350)
            } else {
                image.setTextFont('16px Arial Black')
                image.setColor("#fff")
                image.printText(`${xp} XP`, 118, 115,350)
            }
        if ((_getStat.messageLevel).toString().length == 1) {
             image.setTextFont('38px Arial Black')
             image.setColor("#fff")
             image.printText(`${_getStat.messageLevel}`, 53,77,350)
             } else {
             image.setTextFont('38px Arial Black')
             image.setColor("#fff")
             image.printText(`${_getStat.messageLevel}`, 40,77,350)
             }
             if ((_getStat.messageLevel+1).toString().length == 1) {
             image.setTextFont('38px Arial Black')
             image.setColor("#fff")
            image.printText(`${_getStat.messageLevel+1}`, 233 , 77 ,350)
             } else {
             image.setTextFont('38px Arial Black')
             image.setColor("#fff")
             image.printText(`${_getStat.messageLevel+1}`, 220, 77,350)
            }
            let attach = new AttachmentBuilder(image.toBuffer(), { name: "cartel-seviye.png"});
            message.reply({content: `**Tebrikler!** ${message.member.user.username}
Sohbet seviyeniz yükseldi ve ödülleri kaptınız.`, files: [
               attach
            ]}).then(async (msg) => {
                await client.Economy.updateBalance(message.author.id, Number(2500*(_getStat.messageLevel+1)), "add", 1)
                await client.Economy.updateBalance(message.author.id, Number(1), "add", 0)  
                setTimeout(() => {
                    msg.delete().catch(err => {})
                }, 20000)
            })
    }
    
    }
  }