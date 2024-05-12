let { cartel } = require("./client");
let { Mongoose } = require("../v14BOTSS/Global/Databases/Global.MongoDB.Driver");
let { GUILD } = require("../v14BOTSS/Global/Init/Settings");
const { Websocket } = require("./App");
let { web_info, info } = require("./client_config");

const client = global.client = new cartel({
    intents: [
        3276799
    ],
});

// Client Ayarları (Başlangıç)
client.botName = "API"
// Client Ayarları (SON)
Mongoose.Connect();
GUILD.fetch(client.sistem.SERVER.ID)
let webClient = new Websocket(web_info.port, client)
client.connect(client.sistem.TOKENS.Voucher);