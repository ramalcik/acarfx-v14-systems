const { bgBlue, black, green } = require("chalk");

class Mongoose {
    static Connect(active = sistem.Database.Active, url = sistem.Database.MongoURL) {
        if(active) {
            require('mongoose').set("strictQuery", true).connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: false,
            }).then(() => {
                setTimeout(() => {
                    client.logger.log(`${black.bgHex('#D9A384')(client.botName.toUpperCase())} Connected to the MongoDB.`, "mongodb");
                }, 3000)
            }).catch((err) => {
                client.logger.log(`${black.bgHex('#D9A384')(client.botName.toUpperCase())} Unable to connect to the MongoDB.` + err, "error");
                return process.exit()
            });
        }
    }
}

module.exports = { Mongoose }