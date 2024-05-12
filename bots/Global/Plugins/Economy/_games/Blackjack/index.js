const shuffle = require("shuffle-array")
const games = new Set();
const Discord = require("discord.js");
const Collect = require("./collect")

module.exports = async (message, options) => {

    // check if all the variables given are valid
    if (!message) throw new Error("[MISSING_PARAMETER] The message or interaction parameter was not provided, was null or undefined.")
    
    // check if message and commandInteraction aren't something made up
    if (!(message instanceof Discord.Message) && !(message instanceof Discord.CommandInteraction)) throw new Error("[INVALID_PARAMATER] The message or interaction parameter provided is not valid.")

    // set all the options
    if (!options) options = {} // if options were not provided, make an empty object
    options.transition === "edit" ? options.transition = "edit" : options.transition = "delete" // how they want the embeds to be transitioned
    options.buttons === false ? options.buttons = false : options.buttons = true // check if buttons were enabled
    options.doubledown === false ? options.doubledown = false : options.doubledown = true // check if double down should appear
    options.insurance === false ? options.insurance = false : options.insurance = true // check if double down should appear
    options.split === false ? options.split = false : options.split = true // check if split should appear
    options.resultEmbed === false ? options.resultEmbed = false : options.resultEmbed = true // check if the result embed should be displayed
    options.normalEmbed === false ? options.normalEmbed = false : options.normalEmbed = true // check if they want the default embed when playing
    !options.emojis ? options.emojis = {} : options.emojis
    
    options.emojis = {
        clubs: options.emojis?.clubs || "♣️",
        spades: options.emojis?.spades || "♠️",
        hearts: options.emojis?.hearts || "♥️",
        diamonds: options.emojis?.diamonds || "♦️"
    }
     
    // set what type the message is
    let commandType
    if (message instanceof Discord.Message) {
        commandType = "message"
    } else if (message instanceof Discord.CommandInteraction) {
        commandType = "interaction"
    }

    options.commandType = commandType

    // check if options is an object
    if (options && !(options instanceof Object)) throw new Error(`[INVALID_PARAMATER] The options parameter expected an object, but recieved ${Array.isArray(options) ? "array" : typeof options }`)

    // check if the emojis option is an object
    if (typeof options.emojis !== "object") throw new Error(`[INVALID_PARAMATER] The options.emojis parameter expected an object, but recieved ${typeof options}.`)

    // check if the properties for the options.emojis object are strings.
    if (typeof options.emojis.spades !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.spades option expected a string, but recieved ${typeof options.emojis.spades}`)
    if (typeof options.emojis.hearts !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.hearts option expected a string, but recieved ${typeof options.emojis.hearts}`)
    if (typeof options.emojis.diamonds !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.diamonds option expected a string, but recieved ${typeof options.emojis.diamonds}`)
    if (typeof options.emojis.clubs !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.clubs option expected a string, but recieved ${typeof options.emojis.clubs}`)

    // check if the normalEmbed option was set to false but normalEmbedContent was not provided
    if (options.normalEmbed === false && !options.normalEmbedContent) throw new Error("[MISSING_PARAMETER] The normalEmbedContent option was not provided, was null or undefined when normalEmbed was set to false.")

    // check if the normalEmbed option was set to false but normalEmbedContent is not a EmbedBuilder
    if (options.normalEmbed === false && typeof options.normalEmbedContent !== "object") throw new Error("[INVALID_PARAMATER] The normalEmbedContent parameter provided is not valid.")

    let starterMessage;

    // defer the reply if the commandType is interaction and if the reply has not been deffered
    if (commandType === "interaction" && !message.deferred && !message.replied) {
        starterMessage = await message.deferReply()
    } else if (commandType === "message") {
        starterMessage = await message.reply({ embeds: [{ title: "Oyun başlıyor.", description: "Blackjack başlamak üzere, hazır olmalısın!" }] })
    }

    // check if the user is playing a game
    if (games.has(message.member.id)) {
        if (commandType === "message") {
            message.reply("Zaten oyun oynuyorsun!")
        } else if (commandType === "interaction") {
            if (message.replied || message.deferred) {
                message.followUp({ content: "Zaten oyun oynuyorsun!" })
            } else {
                message.reply({ content: "Zaten oyun oynuyorsun!" })
            }
        }
        return {
            result: "None",
            method: "None",
            yKart: "None",
            dKart: "None"
        }
    }
    

    // set all the variables
    let normalEmbedContent = options.normalEmbedContent ?? "None"
    let transition = options.transition
    let buttons = options.buttons 
    let doubledown = options.doubledown
    let insurance = options.insurance
    let split = options.split
    let resultEmbed = options.resultEmbed
    let normalEmbed = options.normalEmbed
    let userId = message.member.id
    let isSoft = false
    let method = "None"
    let copiedEmbed = {
        content: "",
        value: ""
    }

    // set the decks
    let DECK = [
        { suit: 'clubs', rank: 'A', value: [1, 11], emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '2', value: 2, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '3', value: 3, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '4', value: 4, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '5', value: 5, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '6', value: 6, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '7', value: 7, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '8', value: 8, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '9', value: 9, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '10', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'J', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'Q', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'K', value: 10, emoji: options.emojis.clubs },

        { suit: 'diamonds', rank: 'A', value: [1, 11], emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '2', value: 2, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '3', value: 3, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '4', value: 4, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '5', value: 5, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '6', value: 6, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '7', value: 7, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '8', value: 8, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '9', value: 9, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '10', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'J', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'Q', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'K', value: 10, emoji: options.emojis.diamonds },

        { suit: 'hearts', rank: 'A', value: [1, 11], emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '2', value: 2, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '3', value: 3, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '4', value: 4, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '5', value: 5, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '6', value: 6, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '7', value: 7, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '8', value: 8, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '9', value: 9, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '10', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'J', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'Q', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'K', value: 10, emoji: options.emojis.hearts },

        { suit: 'spades', rank: 'A', value: [1, 11], emoji: options.emojis.spades },
        { suit: 'spades', rank: '2', value: 2, emoji: options.emojis.spades },
        { suit: 'spades', rank: '3', value: 3, emoji: options.emojis.spades },
        { suit: 'spades', rank: '4', value: 4, emoji: options.emojis.spades },
        { suit: 'spades', rank: '5', value: 5, emoji: options.emojis.spades },
        { suit: 'spades', rank: '6', value: 6, emoji: options.emojis.spades },
        { suit: 'spades', rank: '7', value: 7, emoji: options.emojis.spades },
        { suit: 'spades', rank: '8', value: 8, emoji: options.emojis.spades },
        { suit: 'spades', rank: '9', value: 9, emoji: options.emojis.spades },
        { suit: 'spades', rank: '10', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'J', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'Q', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'K', value: 10, emoji: options.emojis.spades },
    ]

    let hitbtn = { label: "Kart", emoji: {id: "958017013731717191"}, style: 2, custom_id: "discord-blackjack-hitbtn", type: 2 }
    let standbtn = { label: "Dur", style: 2, custom_id: "discord-blackjack-standbtn", type: 2 }
    let ddownbtn = { label: "Double", style: 3, custom_id: "discord-blackjack-ddownbtn", type: 2 }
    let splitbtn = { label: "Böl", style: 2, custom_id: "discord-blackjack-splitbtn", type: 2 }
    let insbtn = { label: "Garanti Oyun", style: 3, custom_id: "discord-blackjack-insbtn", type: 2 }
    let noinsbtn = { label: "Riskli Oyun", style: 4, custom_id: "discord-blackjack-noinsbtn", type: 2 }
    let cancelbtn = { label: "Çekil", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }

    let row1 = { type: 1, components: [hitbtn, standbtn] }
    let row2 = { type: 1, components: [cancelbtn] }

    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)

    let currentDeck = DECK
    let testDeck = [
        { suit: 'spades', rank: '5', value: 5, emoji: options.emojis.spades },
        { suit: 'spades', rank: '5', value: 5, emoji: options.emojis.spades },
        ]
    let testDeck2 = [
        { suit: 'spades', rank: 'A', value: [1, 11], emoji: options.emojis.spades },
        { suit: 'spades', rank: '10', value: 10, emoji: options.emojis.spades },
        ]
    // shuffle(testDeck)
    // shuffle(testDeck2)
    let yourcards = [currentDeck.pop(), currentDeck.pop()]
        // let yourcards = [testDeck[0],testDeck[1]]

    let dealercards = [currentDeck.pop(), currentDeck.pop()]
        // let dealercards = [testDeck2[0],testDeck2[1]]

    // set the embeds
    let winEmbed = { title: "Kazandın!", color: 0x008800, description: "", fields: [] }
    let loseEmbed = { title: "Kaybettin!", color: 0xFF0000, description: "", fields: [] }
    let tieEmbed = { title: "Berabere Kalındı!", color: 0xFFFF00, description: "", fields: [] }
    let splitWinEmbed = { title: "Böldün ve iki elide kazandın!", color: 0x008800, description: "", fields: [] }
    let splitLoseEmbed = { title: "Böldün ve iki elide kaybettin!", color: 0xFF0000, description: "", fields: [] }
    let splitTieEmbed = { title: "Böldün ve berabere kaldın!!", color: 0xFFFF00, description: "", fields: [] }
    let splitTieWinEmbed = { title: "Çift Rekabet: İlk el berabere kaldın, ikinci el kazandın.", color: 0x008800, description: "", fields: [] }
    let splitWinTieEmbed = { title: "Çift Rekabet: İlk eli kazandın, ikinci el berabere kaldın.", color: 0x008800, description: "", fields: [] }
    let splitTieLoseEmbed = { title: "Çift Rekabet: İlk el berabere kaldın, ikinci el kaybettin.", color: 0xFF0000, description: "", fields: [] }
    let splitLoseTieEmbed = { title: "Çift Rekabet: İlk eli kaybettin, ikinci el berabere kaldın!.", color: 0xFF0000, description: "", fields: [] }
    let splitWinLoseEmbed = { title: "Çift Rekabet: İlk eli kazandın, ikinci eli kaybettin.", color: 0xFFFF00, description: "", fields: [] }
    let splitLoseWinEmbed = { title: "Çift Rekabet: İlk eli kaybettin ikinci el kazandın.", color: 0xFFFF00, description: "", fields: [] }
    let insWinEmbed = { title: "Kazandın! (Garantili)", color: 0x008800, description: "", fields: [] }
    let insLoseEmbed = { title: "Kaybettin! (Garantili)", color: 0xFF0000, description: "", fields: [] }
    let insTieEmbed = { title: "Berabere (Garantili)", color: 0xFF0000, description: "", fields: [] }
    let insPayEmbed = { title: "Garantilendi", color: 0x008800, description: "", fields: [] }
    let timeoutEmbed = { title: "Zaman aşımı!", color: 0xFF0000, description: "30 Saniye boyunca cevap verilemediğinden dolayı oyun iptal edildi.", fields: [] } 
    let cancelEmbed = { title: "Oyun iptal edildi.", color: 0xFF0000, description: "Oyundan çekildin.", fields: [] }
    let generalEmbed = normalEmbed === false ? options.normalEmbedContent : { title: "Blackjack", 
    description: `Siz bu oyunda "${options.bahis} ${ayarlar.serverName} Parası" kullandınız.
Kazandığınızda, kazanım oranınıza göre birden fazla ödül alacaksınız.`,
     color: Math.floor(Math.random() * (0xffffff + 1)), fields: [{ name: "Senin elin", value: "", inline: true }, { name: `Botun eli`, value: "", inline: true }] }

    // set the filters
    let allFilter = ["h", "hit", "s", "stand", "cancel"]
    
    if (yourcards[0].rank === yourcards[1].rank && yourcards[0].rank === "A") {
        yourcards[0].value = 11
        yourcards[1].value = 1
        isSoft = true
    } else if (yourcards[0].rank === "A") {
        yourcards[0].value = 11 
    } else if (yourcards[1].rank === "A") {
        yourcards[1].value = 11
    }

    if (dealercards[0].rank === dealercards[1].rank && dealercards[0].rank === "A") {
        dealercards[0].value = 11
        dealercards[1].value = 1
        isSoft = true
    } else if (dealercards[0].rank === "A") {
        dealercards[0].value = 11 
    } else if (dealercards[1].rank === "A") {
        dealercards[1].value = 11
    }

    if (yourcards.map(c => c.rank).includes("A")) isSoft = true

    generalEmbed.fields[0].value = `Kartlar: ${yourcards.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nToplam:${isSoft ? " Soft" : ""} ${yourcards.map(c => c.value).reduce((a, b) => b+a)}`
    generalEmbed.fields[1].value = `Kartlar: [\`${dealercards[0].emoji} ${dealercards[0].rank}\`](https://google.com) \` ? \`\nToplam: \` ? \``

    options.embed = generalEmbed
    let yourvalue = yourcards.map(c => c.value).reduce((a, b) => b+a)
    let dealervalue = dealercards.map(c => c.value).reduce((a, b) => b+a)
    
    // check if we can do double down
    if (doubledown === true) {
        if (yourcards.map(a => a.value).reduce((a, b) => b + a) === 9 || (yourcards.map(a => a.value).reduce((a, b) => b+a) === 10 || yourcards.map(a => a.value).reduce((a, b) => b+a) === 11)) {
            row1.components.push(ddownbtn)
            allFilter.push("d")
            allFilter.push("doubledown")
        } 
    }

    // check if we can do split
    if (yourcards[0].rank === yourcards[1].rank && split === true) {
        row1.components.push(splitbtn)
        allFilter.push("split")
    }

    // check if we offer insurance
    if (dealercards[0].rank === "A" && insurance === true) {
        if (yourvalue != 21) {
            row1.components = []
            row1.components.push(insbtn)
            row1.components.push(noinsbtn)
            allFilter.push("i")
            allFilter.push("insurance")
            allFilter.push("ni")
            allFilter.push("noinsurance")
        } 
    }
    
    // start the game
    if (yourvalue === 21 && dealervalue != 21) {
        if (options.resultEmbed === true) {
            winEmbed.description = "Blackjack ile kazandınız!"
            winEmbed.fields.push({ name: "Senin elin", value: `Kartlar: [\`${yourcards[0].emoji} ${yourcards[0].rank}\`](https://google.com) [\`${yourcards[1].emoji} ${yourcards[1].rank}\`](https://google.com)\nToplam: ${yourvalue}` })
            winEmbed.fields.push({ name: "Botun eli", value: `Kart: [\`${dealercards[0].emoji} ${dealercards[0].rank}\`](https://google.com) [\`${dealercards[1].emoji} ${dealercards[1].rank}\`](https://google.com)\nToplam: ${dealervalue}` })
            commandType === "message" ? message.reply({ embeds: [winEmbed] }) : message.reply({ embeds: [winEmbed] })
        }

        return {
            result: "BLACKJACK",
            method: "Blackjack ile kazandınız!",
            yKart: yourcards,
            dKart: dealercards
        }
    }

    // else if (dealervalue === 21 && yourvalue != 21) {
    //     if (options.resultEmbed === true) {
    //         loseEmbed.description = "You lost (dealer had blackjack)."
    //         loseEmbed.fields.push({ name: "Senin elin", value: `Kartlar: [\`${yourcards[0].emoji} ${yourcards[0].rank}\`](https://google.com) [\`${yourcards[1].emoji} ${yourcards[1].rank}\`](https://google.com)\nToplam: ${yourvalue}` })
    //         loseEmbed.fields.push({ name: "Botun eli", value: `Kartlar: [\`${dealercards[0].emoji} ${dealercards[0].rank}\`](https://google.com) [\`${dealercards[1].emoji} ${dealercards[1].rank}\`](https://google.com)\nToplam: ${dealervalue}` })
    //         commandType === "message" ? message.reply({ embeds: [loseEmbed] }) : message.reply({ embeds: [loseEmbed] })
    //     }

    //     return {
    //         result: "LOSE",
    //         method: "You lost (dealer had blackjack).",
    //         yKart: yourcards,
    //         dKart: dealercards
    //     }
    // }

    else if (dealervalue === 21 && dealervalue == yourvalue) {
        if (options.resultEmbed === true) {
            tieEmbed.description = "Berabere! (iki oyuncuda **Blackjack** vardı)"
            tieEmbed.fields.push({ name: "Senin elin", value: `Kartlar: [\`${yourcards[0].emoji} ${yourcards[0].rank}\`](https://google.com) [\`${yourcards[1].emoji} ${yourcards[1].rank}\`](https://google.com)\nToplam: ${yourvalue}` })
            tieEmbed.fields.push({ name: "Botun eli", value: `Kartlar: [\`${dealercards[0].emoji} ${dealercards[0].rank}\`](https://google.com) [\`${dealercards[1].emoji} ${dealercards[1].rank}\`](https://google.com)\nToplam: ${dealervalue}` })
            commandType === "message" ? message.reply({ embeds: [tieEmbed] }) : message.reply({ embeds: [tieEmbed] })
        }

        return {
            result: "TIE",
            method: "Berabere! (iki oyuncuda **Blackjack** vardı)",
            yKart: yourcards,
            dKart: dealercards
        }
    }

    const editReply = async (msg, reply, commandType) => {
        if (commandType === "message") {
            return await msg.edit({ embeds: [reply], components: buttons ? [row1] : [] })
        } else {
            return await message.editReply({ embeds: [reply], components: buttons ? [row1] : [] })
        }
    }
    
    let currentMessage = await editReply(starterMessage, generalEmbed, commandType); 
    let finalResult = await (options.buttons ? new Collect().buttonCollect(currentMessage, userId, yourcards, dealercards, currentDeck, options) : new Collect().messageCollect(currentMessage, userId, yourcards, dealercards, currentDeck, options, allFilter))

    if (options.resultEmbed === true) {
        
        let resultingEmbed = {
            "WIN": winEmbed,
            "BLACKJACK": winEmbed,
            "LOSE": loseEmbed,
            "TIE": tieEmbed,
            "DOUBLE WIN": winEmbed,
            "DOUBLE LOSE": loseEmbed,
            "DOUBLE TIE": tieEmbed,
            "SPLIT WIN-LOSE": splitWinLoseEmbed,
            "SPLIT LOSE-WIN": splitLoseWinEmbed,
            "SPLIT TIE-TIE": splitTieEmbed,
            "SPLIT WIN-WIN": splitWinEmbed,
            "SPLIT LOSE-LOSE": splitLoseEmbed,
            "SPLIT TIE-WIN": splitTieWinEmbed,
            "SPLIT WIN-TIE": splitWinTieEmbed,
            "SPLIT TIE-LOSE": splitTieLoseEmbed,
            "SPLIT LOSE-TIE": splitLoseTieEmbed,
            "SPLIT BLACKJACK-WIN": splitWinEmbed,
            "SPLIT WIN-BLACKJACK": splitWinEmbed,
            "SPLIT BLACKJACK-LOSE": splitWinLoseEmbed,
            "SPLIT LOSE-BLACKJACK": splitLoseWinEmbed,
            "SPLIT BLACKJACK-BLACKJACK": splitWinEmbed,
            "SPLIT BLACKJACK-TIE": splitWinTieEmbed,
            "SPLIT TIE-BLACKJACK": splitTieWinEmbed,
            "SPLIT DOUBLE WIN-LOSE": splitWinLoseEmbed,
            "SPLIT DOUBLE LOSE-WIN": splitLoseWinEmbed,
            "SPLIT DOUBLE TIE-TIE": splitTieEmbed,
            "SPLIT DOUBLE WIN-WIN": splitWinEmbed,
            "SPLIT DOUBLE LOSE-LOSE": splitLoseEmbed,
            "SPLIT DOUBLE TIE-WIN": splitTieWinEmbed,
            "SPLIT DOUBLE WIN-TIE": splitWinTieEmbed,
            "SPLIT DOUBLE TIE-LOSE": splitTieLoseEmbed,
            "SPLIT DOUBLE LOSE-TIE": splitLoseTieEmbed,
            "SPLIT DOUBLE BLACKJACK-WIN": splitWinEmbed,
            "SPLIT DOUBLE WIN-BLACKJACK": splitWinEmbed,
            "SPLIT DOUBLE BLACKJACK-LOSE": splitWinLoseEmbed,
            "SPLIT DOUBLE LOSE-BLACKJACK": splitLoseWinEmbed,
            "SPLIT DOUBLE BLACKJACK-BLACKJACK": splitWinEmbed,
            "SPLIT DOUBLE BLACKJACK-TIE": splitWinTieEmbed,
            "SPLIT DOUBLE TIE-BLACKJACK": splitTieWinEmbed,
            "SPLIT WIN-DOUBLE LOSE": splitWinLoseEmbed,
            "SPLIT LOSE-DOUBLE WIN": splitLoseWinEmbed,
            "SPLIT TIE-DOUBLE TIE": splitTieEmbed,
            "SPLIT WIN-DOUBLE WIN": splitWinEmbed,
            "SPLIT LOSE-DOUBLE LOSE": splitLoseEmbed,
            "SPLIT TIE-DOUBLE WIN": splitTieWinEmbed,
            "SPLIT WIN-DOUBLE TIE": splitWinTieEmbed,
            "SPLIT TIE-DOUBLE LOSE": splitTieLoseEmbed,
            "SPLIT LOSE-DOUBLE TIE": splitLoseTieEmbed,
            "SPLIT BLACKJACK-DOUBLE WIN": splitWinEmbed,
            "SPLIT WIN-DOUBLE BLACKJACK": splitWinEmbed,
            "SPLIT BLACKJACK-DOUBLE LOSE": splitWinLoseEmbed,
            "SPLIT LOSE-DOUBLE BLACKJACK": splitLoseWinEmbed,
            "SPLIT BLACKJACK-DOUBLE BLACKJACK": splitWinEmbed,
            "SPLIT BLACKJACK-DOUBLE TIE": splitWinTieEmbed,
            "SPLIT TIE-DOUBLE BLACKJACK": splitTieWinEmbed,
            "SPLIT DOUBLE WIN-DOUBLE LOSE": splitWinLoseEmbed,
            "SPLIT DOUBLE LOSE-DOUBLE WIN": splitLoseWinEmbed,
            "SPLIT DOUBLE TIE-DOUBLE TIE": splitTieEmbed,
            "SPLIT DOUBLE WIN-DOUBLE WIN": splitWinEmbed,
            "SPLIT DOUBLE LOSE-DOUBLE LOSE": splitLoseEmbed,
            "SPLIT DOUBLE TIE-DOUBLE WIN": splitTieWinEmbed,
            "SPLIT DOUBLE WIN-DOUBLE TIE": splitWinTieEmbed,
            "SPLIT DOUBLE TIE-DOUBLE LOSE": splitTieLoseEmbed,
            "SPLIT DOUBLE LOSE-DOUBLE TIE": splitLoseTieEmbed,
            "SPLIT DOUBLE BLACKJACK-DOUBLE WIN": splitWinEmbed,
            "SPLIT DOUBLE WIN-DOUBLE BLACKJACK": splitWinEmbed,
            "SPLIT DOUBLE BLACKJACK-DOUBLE LOSE": splitWinLoseEmbed,
            "SPLIT DOUBLE LOSE-DOUBLE BLACKJACK": splitLoseWinEmbed,
            "SPLIT DOUBLE BLACKJACK-DOUBLE BLACKJACK": splitWinEmbed,
            "SPLIT DOUBLE BLACKJACK-DOUBLE TIE": splitWinTieEmbed,
            "SPLIT DOUBLE TIE-DOUBLE BLACKJACK": splitTieWinEmbed,
            "INSURANCE PAYOUT": insPayEmbed,
            "INSURANCE WIN": insWinEmbed,
            "INSURANCE LOSE": insLoseEmbed,
            "INSURANCE TIE": insTieEmbed,
            "CANCEL": cancelEmbed,
            "TIMEOUT": timeoutEmbed
        }

        let finalEmbed = resultingEmbed[finalResult.result]
        if (finalResult.method !== "None") {
            finalEmbed.description = finalResult.method
        }
        finalEmbed.fields.push({ name: `Senin elin`, value: `Kartlar: ${finalResult.ycard.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nToplam: ${finalResult.ycard.map(card => card.value).reduce((a, b) => b+a)}`, inline: true })
                if (finalResult.ycard2 != null) {
            finalEmbed.fields.push({ name: `İkinci elin`, value: `Kartlar: ${finalResult.ycard2.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nToplam: ${finalResult.ycard2.map(card => card.value).reduce((a, b) => b+a)}`, inline: true })
        }
        finalEmbed.fields.push({ name: `Botun eli`, value: `Kartlar: ${finalResult.dcard.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nToplam: ${finalResult.dcard.map(card => card.value).reduce((a, b) => b+a)}`, inline: true })
        currentMessage.edit({embeds: [finalEmbed]}).catch(err => {})
        setTimeout(() => {
            currentMessage.delete().catch(err => {})
        }, 12500);
        
        
    }
    return finalResult;
    
}