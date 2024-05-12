const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require('../../../../Global/Init/Embed');
const usersMap = new Map();
const getLimit = new Map();
const LIMIT = 3;
const TIME = 10000;
const DIFF = 1000;
const Discord = require("discord.js")
const capsEngel  = /[^A-ZĞÜŞİÖÇ]/g;
const küfürler =  ["amcık","orospu","piç","sikerim","sikik","amına","pezevenk","yavşak","anandır","orospu","evladı","sokuk","yarrak","oç","o ç","siktir","bacını","karını","amq","anaskm","AMK","YARRAK","sıkerım"];
const reklamlar = ["http://","https://","cdn.discordapp.com","discordapp.com","discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".pw", ".io", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az"]
const inviteEngel = new RegExp(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i);
const { Client, Message } = require("discord.js")

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 */
 client.on("messageCreate", async message => {
    if(message.author.bot || message.channel.type != 0) return;
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar
    if(["719117042904727635"].includes(message.member.id)) return;
    if(message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(message.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.member.roles.cache.has(x))) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(rolAra => message.member.roles.cache.has(rolAra))) return;
    if(_set && !_set.spamEngel) return;
    if(usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const {sonMesaj, timer} = userData;
        const difference = message.createdTimestamp - sonMesaj.createdTimestamp;
        let msgCount = userData.msgCount;
        
            if(difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.sonMesaj = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, TIME);
                usersMap.set(message.author.id, userData)
            } else {
                    msgCount++;
                    if(parseInt(msgCount) === LIMIT) {
                        let datas = await Mute.findOne({_id: message.member.id})
                        if(datas) return;
                        sonMesajlar(message, 30)
                        usersMap.delete(message.author.id);
                        await message.reply({content: `${message.member} Sohbet kanallarında fazla hızlı mesaj gönderdiğiniz için \` 1 Dakika \` süresince susturuldunuz.`}).then(x => setTimeout(() => {
                            x.delete().catch(err => {})
                        }, 7500)).catch(err => {})
                      
                        return message.member.cezaEkle(5, message.guild.members.cache.get(client.user.id) ? message.guild.members.cache.get(client.user.id) : message.member, "Metin Kanallarında Flood Yapmak!", message, "1m", true);
                     } else {
          userData.msgCount = msgCount;
          usersMap.set(message.author.id, userData)
        }}}
         else{
        let fn = setTimeout(() => {
          usersMap.delete(message.author.id)
        }, TIME);
        usersMap.set(message.author.id, {
        msgCount: 1,
        sonMesaj: message,
        timer: fn
        
        })
        }
})

module.exports = async (message) => {
    if(message.author.bot || message.channel.type != 0) return;
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar

    if(["719117042904727635"].includes(message.member.id)) return;
    if(message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(message.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.member.roles.cache.has(x))) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(rolAra => message.member.roles.cache.has(rolAra))) return;


    if (message.channel.id == kanallar.photoChatKanalı && message.attachments.size < 1) await message.delete();

    if ((message.mentions.roles.size + message.mentions.users.size + message.mentions.channels.size) >= 3) return sendChat(message, "birden fazla etiket atmaktan vazgeç")
 
    if (_set.küfürEngel === true && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(message.content))) return sendChat(message, "küfür etmekten vazgeç")



    if(message.content && message.content.length && message.content.length >= 165)  return sendChat(message, "uzun mesaj atmamaya özen göster")
    const Caps = (message.content.match(/[A-ZĞÇÖIÜ]/gm) || []).length;
    if ((_set && _set.capsEngel) && (Caps / message.content.length) >= 0.7) return  sendChat(message, "Caps-Lock kullanmamalısın")

    if (_set.reklamEngel === true && message.content.match(inviteEngel)) {
        const invites = await message.guild.invites.fetch();
        if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;
        return sendChat(message, "reklam yapmaktan vazgeç")
    }

    if(_set.reklamEngel === true && reklamlar.some(word => message.content.toLowerCase().includes(word))) return  sendChat(message, "reklam yapmaktan vazgeç")



}

module.exports.config = {
    Event: "messageCreate"
};

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar 
    if(newMessage.author.bot || newMessage.channel.type != 0) return;
    if(["719117042904727635"].includes(newMessage.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(newMessage.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => newMessage.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => newMessage.member.roles.cache.has(x))) return;
    if(newMessage.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(rolAra => newMessage.member.roles.cache.has(rolAra))) return;
    if (newMessage.channel.id == kanallar.photoChatKanalı && newMessage.attachments.size < 1) await message.delete();
    if (_set.küfürEngel === true && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(newMessage.content))) newMessage.delete().catch(err => {});

    if (newMessage.content.replace(capsEngel, "").length >= newMessage.content.length / 2) {
        if (newMessage.content.length <= 15) return;
        if (newMessage.deletable) newMessage.delete().catch(err => err);
    }
    if (_set.reklamEngel === true && newMessage.content.match(inviteEngel)) {
        const invites = await newMessage.guild.invites.fetch();
        if ((newMessage.guild.vanityURLCode && newMessage.content.match(inviteEngel).some((i) => i === newMessage.guild.vanityURLCode)) || invites.some((x) => newMessage.content.match(inviteEngel).some((i) => i === x))) return;
        return newMessage.delete().catch(err => {});
    }
    if(_set.küfürEngel === true && reklamlar.some(word => newMessage.content.toLowerCase().includes(word))) return newMessage.delete().catch(err => {})
   
});


client.on("messageDelete", async (message, channel) => {
    if(message.author.bot || message.channel.type != 0) return;
      if (message.author.bot) return;
      let silinenMesaj = message.guild.channels.cache.get("mesaj-log")
      if(!silinenMesaj) return;
      const embed = new genEmbed()
      .setAuthor({name: `Mesaj Silindi`, iconURL: message.author.avatarURL({ extension: "png"})})
      .setDescription(`${message.member} kişisi bir mesaj sildi.`)
      .addFields({ name: "Kanal Adı", value: `${message.channel.name}`, inline: true})
      .addFields({ name: "Silinen Mesaj", value: `${message.content ? `${message.content.length > 0 ? message.content : "Bir mesaj bulunamadı!"}` : "Bir mesaj bulunamadı!"}`, inline: true})
           .setThumbnail(message.author.avatarURL())
      silinenMesaj.send({ embeds: [embed]}).catch(err => {})
      
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(newMessage.author.bot || newMessage.channel.type != 0) return;
      let guncellenenMesaj = newMessage.guild.channels.cache.get("mesaj-log")
      if(!guncellenenMesaj) return;
      if (oldMessage.content == newMessage.content) return;
      let embed = new genEmbed()
      .setAuthor({name: `Mesaj Düzenlendi`, iconURL: newMessage.author.avatarURL({ extension: "png"})})
      .setDescription(`${newMessage.author} kişisi bir mesaj düzenledi`)
      .addFields({ name: "Eski Mesaj", value: `${oldMessage.content}`, inline: true})
      .addFields({ name: "Yeni Mesaj", value: `${newMessage.content}`, inline: true})
      .addFields({ name: "Kanal Adı",  value: `${newMessage.channel.name}`, inline: true})
      .setThumbnail(newMessage.author.avatarURL())
      guncellenenMesaj.send({embeds: [embed]}).catch(err => {})
});

async function sendChat(message, content) {
    if (getLimit.get(message.author.id) == 3) {
        let datas = await Mute.findOne({_id: message.member.id})
        if(datas) return;
        message.delete().catch(err => {})
        getLimit.delete(message.member.id)
        await message.reply({content: `${message.member} Sohbet kanallarında ki kurallara uyum sağlanmadığı için \` 10 Dakika \` süresince susturuldunuz.`}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500)).catch(err => {})
        return message.member.cezaEkle(5, message.guild.members.cache.get(client.user.id) ? message.guild.members.cache.get(client.user.id) : message.member, "Sohbet Kurallarına Uyulmadı!", message, "10m", false, true) 
    } else {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        message.delete().catch(err => {})
        let embed = new genEmbed()
        message.channel.send({content: `${message.member}`, embeds: [embed.setDescription(`Merhaba ${message.member}!
        ${content} aksi takdirde cezaya çarptırılıcaksın.
    `)]}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 6000);
        })
        setTimeout(() => {
            if(getLimit.get(`${message.member.id}`)) getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
          }, 10000)
    }
    
    
}
async function sonMesajlar(message, count = 25) {
    let messages = await message.channel.messages.fetch({ limit: 100 });
    let filtered = messages.filter((x) => x.author.id === message.author.id).array().splice(0, count);
    message.channel.bulkDelete(filtered).catch(err => {});
   } 