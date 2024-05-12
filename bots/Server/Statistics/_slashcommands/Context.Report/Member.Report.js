const { Client, ContextMenuCommandInteraction, ApplicationCommandType } = require("discord.js");
const moment = require('moment')
moment.locale("tr");
const ms = require("ms");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

module.exports = {
    name: "Rapor Et ✅",
    description: "Testde!",
    type: ApplicationCommandType.User,
    /**
     *
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, int, args) => {
        let message = int
        let check = await client.users.fetch(message.targetId)
        let uye = message.guild.members.cache.get(check.id)
        let yetkili = message.guild.members.cache.get(int.member.id)
        let reportChannel = message.guild.kanalBul("şikayet-log")
        if(reportChannel) reportChannel.send({content: `${[ ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => message.guild.roles.cache.get(x))}`,embeds: [new genEmbed().setDescription(`${uye} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${yetkili} üyesi tarafından şikayet edildi.`)]})
        await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesini şikayet ettiniz.`, ephemeral: true})
    }
};