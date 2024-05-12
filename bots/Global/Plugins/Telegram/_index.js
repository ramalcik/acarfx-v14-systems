
const TBOT = require('node-telegram-bot-api');
let chatIds = ["-1001506634639"]
class Telegram extends TBOT {
    constructor() {
        super("5298348437:AAHB8gr7uI4v00gJwroKAgiOTZJ9VE6Wn0c", {polling: true})
    }

    async bilgilendirmeGönder(content) {
        chatIds.map(id => {
            this.sendMessage(id, `${content}`)
        })
    }
}

module.exports = {Telegram}