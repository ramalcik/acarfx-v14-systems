const { Collection } = require('discord.js');

/**
 * 
 * @param {Client} invite 
 */

module.exports = async (invite) => {
    invite.guild.invites.fetch().then((guildInvites) => {
        const cacheInvites = new Collection();
        guildInvites.map((inv) => {
          cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
        });
        client.invites.set(invite.guild.id, cacheInvites);
      });
}

module.exports.config  = {
    Event: "inviteCreate"
}