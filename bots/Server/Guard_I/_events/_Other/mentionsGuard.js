const { Message, PermissionFlagsBits } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
 /**
 * @param {Message} oldMessage
 * @param {Message} newMessage
 */


module.exports = async (oldMessage, newMessage) => {
    let embed = new genEmbed().setTitle("Sunucuda Duyuru Atıldı!")
    if ((newMessage.content.includes('@everyone') || newMessage.content.includes('@here'))) { 
        const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
        let Data = await Guard.findOne({guildID: oldMessage.guild.id})
        if(Data && !Data.everyoneGuard) return;
        let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
        const _set = _findServer.Ayarlar
        let uye = newMessage.member;
        if(!uye.permissions.has(PermissionFlagsBits.MentionEveryone)) return;
        if(await client.checkMember(newMessage.author.id, undefined ,"Gereksiz Duyuru Kullanımı!") || _set.chatİzinliler && _set.chatİzinliler.includes(newMessage.member.id)) return;
        await newMessage.delete()
        client.punitivesAdd(uye.id, "jail")
       // client.allPermissionClose()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi @everyone & @here yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = newMessage.guild.kanalBul("guard-log");
        if(loged) await loged.send({embeds: [embed]});
        const owner = await newMessage.guild.fetchOwner();
        if(owner) owner.send({embeds: [embed]}).catch(err => {})
        client.processGuard({
            type: "İzinsiz Duyuru Kullanımı!",
            target: newMessage.author.id,
        })
    }
}

module.exports.config = {
    Event: "messageUpdate"
}


/**
 * @param {Client} client 
 * @param {Message} message
 */

client.on("messageCreate", async (message) => {
    let embed = new genEmbed().setTitle("Sunucuda Duyuru Atıldı!")
    if ((message.content.includes('@everyone') || message.content.includes('@here'))) { 
        const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
        let Data = await Guard.findOne({guildID: message.guild.id})
        if(Data && !Data.everyoneGuard) return;
        let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
        const _set = _findServer.Ayarlar
        let uye = message.member;
        if(!uye.permissions.has('MENTION_EVERYONE')) return;
        if(await client.checkMember(message.author.id, undefined ,"Gereksiz Duyuru Kullanımı!") || _set.chatİzinliler && _set.chatİzinliler.includes(message.member.id)) return;
        await message.delete()
        client.punitivesAdd(uye.id, "jail")
        //client.allPermissionClose()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi \`@everyone & @here\` yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = message.guild.kanalBul("guard-log");
        if(loged) await loged.send({embeds: [embed]});
        const owner = await message.guild.fetchOwner();
        if(owner) owner.send({embeds: [embed]})
        client.processGuard({
            type: "İzinsiz Duyuru Kullanımı!",
            target: message.author.id,
        })
    }
})