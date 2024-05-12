const { Client, Message, Collection } = require("discord.js");
const Roles = require('../../../../Global/Databases/Schemas/Guards/Guild.Protection.Roles.Backup');
const util = require("util")
const { genEmbed } = require('../../../../Global/Init/Embed')
let kapatılanPermler = new Collection()
const Discord = require("discord.js")
module.exports = {
    Isim: "debug",
    Komut: ["proc","yt"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let type = args[0]
    if(!type) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    
    switch (type) {
        case "kapat": {
            const perms = [
                Discord.PermissionFlagsBits.Administrator,
                Discord.PermissionFlagsBits.ManageRoles,
                Discord.PermissionFlagsBits.ManageChannels,
                Discord.PermissionFlagsBits.ManageGuild,
                Discord.PermissionFlagsBits.ManageWebhooks
                    ];
            let roller = message.guild.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
            message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${roller.map(x => x).join(", ")} rolün(lerin), koruması başarıyla <t:${String(Date.now()).slice(0, 10)}:R> açıldı ve izinleri kapatıldı.`)]}).then(x => {
                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                setTimeout(() => {
                    x.delete()
                }, 8500);
            })
            roller.forEach(async (rol) => {
                await Roles.updateOne({Role: rol.id}, {$set: {"guildID": message.guild.id, Reason: "Koruma Komutu Çalıştırıldı!", "Permissions": rol.permissions.bitfield }}, {upsert: true})
                await kapatılanPermler.set(rol.id, rol.permissions.bitfield)
                await rol.setPermissions(0n)
            })
            return;
        }
            
        case "aç": {
            let Roller = await Roles.find({})
            Roller.filter(x => message.guild.roles.cache.get(x.Role)).forEach(async (data) => {
                let rolgetir = message.guild.roles.cache.get(data.Role)
                if(rolgetir) rolgetir.setPermissions(data.Permissions);
            })
            await Roles.deleteMany({guildID: message.guild.id})
            return message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${Roller.map((x, key) => message.guild.roles.cache.get(x.Role)).join(", ")} rolün(lerin), koruması başarıyla <t:${String(Date.now()).slice(0, 10)}:R> kapatıldı ve izinleri tekrardan açıldı.`)]}).then(x => {
                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                setTimeout(() => {
                    x.delete()
                }, 8500);
            })
        }
    }
  
  }
};