const { Client, ContextMenuCommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const moment = require('moment')
moment.locale("tr");
const ms = require("ms");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

module.exports = {
    name: "Beğen/Beğenme 👍",
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
        let member = message.guild.members.cache.get(check.id)
        let author = message.guild.members.cache.get(int.member.id)
        let author_data = await Users.findOne({_id: author.id})
        let member_data = await Users.findOne({_id: member.id})
        if(member.id == author.id) return int.followUp({content: `${message.guild.emojiGöster(emojiler.Iptal)} Kendinizi beğenemezsiniz.`, ephemeral: true})

        if(member_data.Likes.includes(author.id)) {
            await Users.updateOne({_id: member.id}, {
                $pull: {Likes: author.id}
            }, {upsert: true})
            await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üyeyin beğenisini kaldırdınız.`, ephemeral: true})
        } else {
            await Users.updateOne({_id: member.id}, {
                $push: {Likes: author.id}
            }, {upsert: true})
            await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üyeyi beğendiniz.`, ephemeral: true})
        }
       
    }
};