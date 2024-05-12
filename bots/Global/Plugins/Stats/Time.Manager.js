const Guild = require("../../Databases/Schemas/Client.Guilds.Times");

class TimeManager {
    static async getDay(id) {
        let x = await Guild.findOne({ guildId: id}).exec().then((doc) => {
            if (!doc) {
                new Guild({ guildId: Id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
                return 1;
            }
            else {
                return doc.Day;
            }
        });
        return x;
    }

    static async setToday(id) {
        await Guild.updateOne({ guildId: id}, { $set: { Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) } }, { upsert: true })
    }

    static async addDay(id, value) {
        await Guild.updateOne({ guildId: id}, { $inc: { Day: value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }
    static async sumDay(id, value) {
        await Guild.updateOne({ guildId: id}, { $inc: { Day: -value } }, { upsert: true, setDefaultsOnInsert: true }).exec((err, doc) => {
            if (err) console.error(err);
        });
    }

    static async checkDay(id) {
        let data = await Guild.findOne({ guildId: id})
        if (!data) return new Guild({ guildId: id, Day: 1, NextUpdate: new Date().setHours(24, 0, 0, 0) }).save();
        if (data.NextUpdate < Date.now()) {
            data.NextUpdate = new Date().setHours(24, 0, 0, 0);
            data.Day += 1;
        }
        data.save();
    }
}

module.exports = TimeManager;