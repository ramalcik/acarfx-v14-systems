const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Invite = require('../../../../Global/Databases/Schemas/Global.Guild.Invites')
const Discord = require("discord.js")
module.exports = {
    Isim: "invite",
    Komut: ["davet","davetlerim"],
    Kullanim: "invite <@cartel/ID>",
    Aciklama: "Belirtilen üye veya komutu kullanan üyenin davet bilgilerini görüntüler.",
    Kategori: "stat",
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
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const data = await Invite.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = data ? data.total ? data.total  : 0: 0;
    const regular = data ? data.regular ? data.regular  : 0: 0;
    const bonus = data ? data.bonus ? data.bonus  : 0: 0;
    const leave = data ? data.leave ? data.leave  : 0: 0;
    const fake = data ? data.fake ? data.fake  : 0: 0;
    const invMember = await Invite.find({ Inviter: member.user.id });
    const bazıları = invMember ? invMember.filter(value => message.guild.members.cache.get(value.userID)).slice(0, 7).map((value, index) => message.guild.members.cache.get(value.userID)).join(", ") : undefined
    const daily = invMember ? message.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? message.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    const tagged = invMember ? message.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && usr.user.username.includes(ayarlar.tag)).size : 0;
    message.channel.send({
      embeds: [new genEmbed().setDescription(`${member} isimli üye toplam **${total + bonus}** (**Bonus**: \` +${bonus} \`) davete sahip. (**${regular}** giren, ${ayarlar.type ? ` **${tagged}** taglı, ` : ``}**${leave}** ayrılmış, **${fake}** sahte, **${daily}** günlük, **${weekly}** haftalık)

${bazıları ? `Davet ettiği bazı kişiler: ${bazıları}` : ''}`)]
    });

    }
};