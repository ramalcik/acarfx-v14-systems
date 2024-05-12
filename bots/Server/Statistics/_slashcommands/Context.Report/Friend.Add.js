const { Client, ContextMenuCommandInteraction, ApplicationCommandType } = require("discord.js");
const moment = require('moment')
moment.locale("tr");
const ms = require("ms");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

module.exports = {
    name: "Takip Et/Etme ✅",
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
        if(member.id == author.id) return int.followUp({content: `${message.guild.emojiGöster(emojiler.Iptal)} Kendinizi takip etmeye çalıştınız.`, ephemeral: true})

        if(author_data && member_data && author_data.FollowUp.includes(member.id) && member_data.Follower.includes(author.id)) {
            await Users.updateOne({_id: member.id}, {
                $pull: {Follower: author.id}
            }, {upsert: true})
            await Users.updateOne({_id: author.id}, {
                $pull: {FollowUp: member.id}
            }, {upsert: true})
            if(member_data.FollowUp.includes(author.id)) {
                await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üyeyi takpipten çıktınız ve arkadaş listesinden kaldırıldı.`, ephemeral: true})
                member.send(`${int.guild.emojiGöster(emojiler.Iptal)} **${author.user.username}** isimli arkadaşınız sizi takipten **<t:${String(Date.now()).slice(0,10)}:R>** çıktı ve arkadaş listenizden kaldırıldı.`)
                .catch(err => {      
                })
                await Users.updateOne({_id: author.id}, {
                    $pull: {Friends: member.id}
                }, {upsert: true})
                await Users.updateOne({_id: member.id}, {
                    $pull: {Friends: author.id}
                }, {upsert: true})
            } else {
                await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üyeyi takipten çıktınız.`, ephemeral: true})
                member.send(`${int.guild.emojiGöster(emojiler.Iptal)} **${author.user.username}** sizi takipten **<t:${String(Date.now()).slice(0,10)}:R>** çıktı.`)
                .catch(err => {      
                })
            }
        } else {
            await Users.updateOne({_id: member.id}, {
                $push: {Follower: author.id}
            }, {upsert: true})
            await Users.updateOne({_id: author.id}, {
                $push: {FollowUp: member.id}
            }, {upsert: true})
            if(member_data && member_data.FollowUp.includes(author.id)) {
                await Users.updateOne({_id: author.id}, {
                    $push: {Friends: member.id}
                }, {upsert: true})
                await Users.updateOne({_id: member.id}, {
                    $push: {Friends: author.id}
                }, {upsert: true})
                await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üye ile birbirinizi takip ederek arkadaş oldunuz.`, ephemeral: true})
                member.send(`${int.guild.emojiGöster(emojiler.Onay)} **${author.user.username}** ile birbirinizi **<t:${String(Date.now()).slice(0,10)}:R>** karşılıklı takip ederek arkadaş oldunuz.`)
                .catch(err => {
                    
                })
            } else {
                await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} isimli üyeyi takip etmeye başladınız.`, ephemeral: true})
                member.send(`${int.guild.emojiGöster(emojiler.Iptal)} **${author.user.username}** sizi **<t:${String(Date.now()).slice(0,10)}:R>** takip etmeye başladı.`)
                .catch(err => {
                    
                })
            }
        }
        
       
    }
};