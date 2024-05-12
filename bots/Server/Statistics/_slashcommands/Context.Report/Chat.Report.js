const { Client, EmbedBuilder, ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");
const moment = require('moment')
moment.locale("tr");
const ms = require("ms");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    name: "Mesajı Bildir 📛",
    description: "Testde!",
    type: ApplicationCommandType.Message,
    /**
     *
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, int, args) => {
        let kanal = int.guild.channels.cache.get(int.channelId)
        let msg = await kanal.messages.fetch(int.targetId)
        let message = msg
        let check = await client.users.fetch(message.author.id)
        let uye = message.guild.members.cache.get(check.id)
        let yetkili = message.guild.members.cache.get(int.member.id)
        let reportChannel = message.guild.kanalBul("şikayet-log")
        if(reportChannel) reportChannel.send({content: `${roller.Buttons.chatSorumlusu ? message.guild.roles.cache.get(roller.Buttons.chatSorumlusu) ? message.guild.roles.cache.get(roller.Buttons.chatSorumlusu) : [ ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => message.guild.roles.cache.get(x)) : [ ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => message.guild.roles.cache.get(x))}`,embeds: [new genEmbed().setDescription(`${uye} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${yetkili} üyesi tarafından attığı mesaj şikayet edildi.`).addFields(
            { 
              name: '` ••❯ ` Mesaj Bilgisi', 
              value: `${uye} tarafından ${message.channel} (\`${message.channel.id}\`) kanalına ${tarihHesapla(message.createdTimestamp)} önce yazıldı.`,
              inline: false 
            },
            { 
              name: '` ••❯ ` Mesaj İçeriği', 
              value: `> ${message.content}`,
              inline: false 
            }
          )]})
        await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesinin \`${message.content}\` içeriğine sahip mesajı, bildirildi.`, ephemeral: true})
    }
};