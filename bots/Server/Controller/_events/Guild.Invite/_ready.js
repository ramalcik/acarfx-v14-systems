const {Collection} = require('discord.js');
const StatsSchema = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
/**
 * @param { Client } ready
 */

module.exports = async () => {
    const guild = client.guilds.cache.get(sistem.SERVER.ID)
    guild.invites.fetch().then((guildInvites) => {
      const cacheInvites = new Collection();
      guildInvites.map((inv) => {
        cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
      });
      client.invites.set(guild.id, cacheInvites);
    });
    
};

module.exports.config = {
    Event: "ready"
}

