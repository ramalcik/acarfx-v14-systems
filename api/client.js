const { Client, Collection } = require("discord.js");
const { black } = require("chalk");
global.sistem = global.system = require('../v14BOTSS/Global/Settings/_system.json');
const { GUILD } = require('../v14BOTSS/Global/Init/Settings');
const EventEmitter = require('events');
class cartel extends Client {
    constructor(...options) {
        super({
            options,
            intents: 3276799,
        });
        this.sistem = this.system = require('../v14BOTSS/Global/Settings/_system.json');
        GUILD.fetch(this.sistem.SERVER.ID)
        this.logger = require('../v14BOTSS/Global/Functions/Logger');
        this.Upstaffs = {}
        this._statSystem = global._statSystem = {}
        require('../v14BOTSS/Global/Functions/Dates');
        require('../v14BOTSS/Global/Functions/Numbers');
        require('../v14BOTSS/Global/Prototypes/_sources');
        require('../v14BOTSS/Global/Prototypes/_user');
        this.botName;
        this.commands = new Collection();
        this.slashcommands = new Collection();
        this.aliases = new Collection();
        this.eventEmitter = new EventEmitter();
        this.setMaxListeners(10000);

    }

   
    connect(token) {
        if (!token) {
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`, "error");
            process.exit()
            return;
        }
        this.login(token).then(cartel => {
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`, "botReady")
            this.on("ready", async () => {
            this.Upstaffs = require('../v14BOTSS/Global/Plugins/Staff/_index');
                this._statSystem = global._statSystem = require('../v14BOTSS/Global/Plugins/Staff/Sources/_settings');
            })
        }).catch(cartel => {
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`, "reconnecting")
            setTimeout(() => {
                this.login().catch(cartel => {
                    this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`, "error")
                    process.exit()
                })
            }, 5000)
        })
    }

}

module.exports = { cartel }