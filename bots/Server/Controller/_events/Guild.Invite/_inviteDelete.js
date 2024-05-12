const { Collection } = require('discord.js');

/**
 * @param {Client} invite
 */

module.exports = async (invite) => {
    setTimeout(async () => {
        invite.guild.invites.fetch().then((guildInvites) => {
          const cacheInvites = new Collection();
          guildInvites.map((inv) => {
            cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
          });
          client.invites.set(invite.guild.id, cacheInvites);
        });
      }, 5000)
}

module.exports.config = {
    Event: "inviteDelete"
}