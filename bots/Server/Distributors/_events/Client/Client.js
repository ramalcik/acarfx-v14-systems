const CronJob = require('cron').CronJob
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
module.exports = async () => {
    let Aylık_systemcik = new CronJob('00 00 00 * * 1', async function() {
        let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
        let systemcik = Data.Ayarlar
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        if(!systemcik.aylikUye) return;
        if(systemcik.aylikUye && !systemcik.birAy) return await GUILD_SETTINGS.updateOne({guildID: message.guild.id}, {$set: {[`Ayarlar.aylikUye`]: false}}, {upsert: true}).catch(e => console.log(e));;
        if(systemcik.aylikUye && systemcik.birAy && !guild.roles.cache.has(systemcik.birAy)) return await GUILD_SETTINGS.updateOne({guildID: message.guild.id}, {$set: {[`Ayarlar.aylikUye`]: false}}, {upsert: true}).catch(e => console.log(e));
        guild.members.cache.filter(x => !x.user.bot && Date.now() - x.joinedAt > 1000 * 60 * 60 * 24 * 30 && !x.permissions.has(Discord.PermissionFlagsBits.Administrator) && !x.roles.cache.has(roller.jailRolü) && !x.roles.cache.has(roller.şüpheliRolü)  && !x.roles.cache.has(roller.yasaklıTagRolü) && !roller.kayıtsızRolleri.some(rol => x.roles.cache.has(rol))).forEach(async (uye) => {
            if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 30) {
                if(!uye.roles.cache.has(systemcik.birAy)) await uye.roles.add(systemcik.birAy)
            }
            if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 90) {
                if(uye.roles.cache.has(systemcik.birAy)) await uye.roles.remove(systemcik.birAy)
                if(!uye.roles.cache.has(roller.ucAy)) await uye.roles.add(systemcik.ucAy)
            }
            if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 180) {
                if(uye.roles.cache.has(systemcik.ucAy)) await uye.roles.remove(systemcik.ucAy)
                if(!uye.roles.cache.has(systemcik.altiAy)) await uye.roles.add(systemcik.altiAy)
            }
            if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 270) {
                if(uye.roles.cache.has(systemcik.altiAy)) await uye.roles.remove(systemcik.altiAy)
                if(!uye.roles.cache.has(systemcik.dokuzAy)) await uye.roles.add(systemcik.dokuzAy)
            }
            if(Date.now() - uye.joinedAt > 1000 * 60 * 60 * 24 * 365) {
                if(uye.roles.cache.has(systemcik.dokuzAy)) await uye.roles.remove(systemcik.dokuzAy)
                if(!uye.roles.cache.has(systemcik.birYil)) await uye.roles.add(systemcik.birYil)
            }
        })    
    }, null, true, 'Europe/Istanbul');

    Aylık_systemcik.start();
}
module.exports.config = {
    Event: "ready"
};