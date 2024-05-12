const { GuildMember, EmbedBuilder } = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */
module.exports = async (ban) => {
    let entry = await ban.guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor) return;
    if(entry.executor.id == client.user.id) return;
    await Punitives.findOne({Member: ban.user.id, Type: "Yasaklama", Active: true}).exec(async (err, res) => {
            if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: entry.executor.id} }, { upsert: true })
            let findChannel = ban.guild.kanalBul("ban-log");
            if(findChannel) await findChannel.send({embeds: [new genEmbed().setDescription(`${ban.user} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, <t:${String(Date.now()).slice(0, 10)}:R> ${entry.executor} tarafından kaldırıldı.`)]})
    })
 }

module.exports.config = {
    Event: "guildBanRemove"
}
