const { Message, EmbedBuilder } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require("../../../../Global/Init/Embed");
const commandBlocks = require('../../../../Global/Databases/Schemas/Others/Users.Command.Blocks');
const ms = require('ms');
const spamCommandCount = new Map()
const Discord = require("discord.js")
 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
    // Sync Data's
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
    emojiler = client._emojis = global.emojiler = global._emojis = require('../../../../Global/Settings/_emojis.json');
    cevaplar = client._reply = global.cevaplar = global._reply = require('../../../../Global/Settings/_reply');
    var reload = require('require-reload')(require);
    _statSystem = global._statSystem =  reload('../../../../Global/Plugins/Staff/Sources/_settings.js');
    // Sync Data's

    if (message.author.bot || !global.sistem.botSettings.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type != 0) return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let cartel = message.client;
    args = args.splice(1);
    let calistirici;
    let TalentPerms;
    if(cartel.commands.has(komutcuklar) || cartel.aliases.has(komutcuklar)) {
      if((kanallar.izinliKanallar && !kanallar.izinliKanallar.some(x => message.channel.id == x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayarlar.staff.includes(message.member.id) && !["temizle","sil","booster","b","snipe","afk","kilit"].some(x => komutcuklar == x) ) {
        return 
      }
      try {
          calistirici = cartel.commands.get(komutcuklar) || cartel.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(cartel, message, args);
      } catch (err) {
        message.channel.send({content: `Bu komut çalıştırılırken hata oluştu... \`\`\`${err}\`\`\` `}).then(x => { 
          client.logger.log(`${komutcuklar} isimli komut çalıştırılırken hata oluştu.`,"error")
          setTimeout(() => {
            x.delete()
          }, 7500)
        })
     }
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
