class Collect {

    async buttonCollect(message, userId, yourcard, dealercard, DECK, options) {
        let filter = async i => {
            await i.deferUpdate()
            return ["discord-blackjack-hitbtn", "discord-blackjack-splitbtn", "discord-blackjack-standbtn", "discord-blackjack-ddownbtn", "discord-blackjack-cancelbtn", "discord-blackjack-insbtn", "discord-blackjack-noinsbtn"].includes(i.customId) && i.user.id === userId
        }
        let result = await message.awaitMessageComponent({ filter, time: 30000 })
            .then(async i => {
                switch (i.customId) {
                    case "discord-blackjack-hitbtn": {
                        return this.hit(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-splitbtn": {
                        return this.split(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-standbtn": {
                        return this.stand(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-ddownbtn": {
                        return this.doubledown(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-cancelbtn": {
                        return this.cancel(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-insbtn": {
                        return this.insurance(message, userId, yourcard, dealercard, DECK, options)
                    }
                    case "discord-blackjack-noinsbtn": {
                        return this.noinsurance(message, userId, yourcard, dealercard, DECK, options)
                    }
                }
            })
            .catch((e) => {

                if (options.transition === "edit") {
                    return {
                        result: "TIMEOUT",
                        method: "None",
                        ycard: yourcard,
                        dcard: dealercard,
                        message: message
                    }
                } else if (options.transition === "delete") {
                    message.delete()
                    return {
                        result: "TIMEOUT",
                        method: "None",
                        ycard: yourcard,
                        dcard: dealercard
                    }
                }

            })

        return result
    }

    async messageCollect(message, userId, yourcard, dealercard, DECK, options, filter1) {
        if (!filter1) filter1 = ["h", "hit", "s", "stand", "cancel"]
        let filter = i => filter1.includes(i.content.toLowerCase()) && i.author.id === userId
        let result = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async msg => {

                msg = msg.first()
                if (!msg) {
                    if (options.transition === "edit") {
                        return {
                            result: "TIMEOUT",
                            method: "None",
                            ycard: yourcard,
                            dcard: dealercard,
                            message: message
                        }
                    } else if (options.transition === "delete") {
                        message.delete()
                        return {
                            result: "TIMEOUT",
                            method: "None",
                            ycard: yourcard,
                            dcard: dealercard
                        }
                    }
                }
                if (msg.content.toLowerCase().startsWith("h")) {
                    return this.hit(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase() === "split" && filter1.includes("split")) {
                    return this.split(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase().startsWith("d") && filter1.includes("d")) {
                    return this.doubledown(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase().startsWith("s")) {
                    return this.stand(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase() === "cancel") {
                    return this.cancel(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase() === "i") {
                    return this.insurance(message, userId, yourcard, dealercard, DECK, options)
                } else if (msg.content.toLowerCase() === "ni") {
                    return this.noinsurance(message, userId, yourcard, dealercard, DECK, options)
                }
            }).catch(e => {
                if (options.transition === "edit") {
                    return {
                        result: "TIMEOUT",
                        method: "None",
                        ycard: yourcard,
                        dcard: dealercard,
                        message: message
                    }
                } else if (options.transition === "delete") {
                    message.delete()
                    return {
                        result: "TIMEOUT",
                        method: "None",
                        ycard: yourcard,
                        dcard: dealercard
                    }
                }


            })

        return result
    }

    async hit(message, userId, yourcard, dealercard, DECK, options) {
        let gotCard = DECK.pop()
        let embed = options.embed
        let isSoft = false
        if (gotCard.rank === "A") {
            if (yourcard.map(c => c.rank).includes("A")) {
                gotCard.value = 1
            } else {
                gotCard.value = 11
            }
        }

        yourcard.push(gotCard)

        if (yourcard.map(c => c.rank).includes("A") && yourcard.find(c => c.rank === "A" && c.value === 11)) {
            isSoft = true
        }

        if (yourcard.map(c => c.value).reduce((a, b) => b + a) > 21 && isSoft == true) {
            isSoft = false
            for (let y = 0; y < yourcard.length; y++) {
                if (yourcard[y].rank === "A") {
                    yourcard[y].value = 1
                }
            }
        }

        if (yourcard.map(c => c.value).reduce((a, b) => b + a) >= 21) {
            return this.stand(message, userId, yourcard, dealercard, DECK, options)
        }


        embed.fields[0].value = `Kartlar: ${yourcard.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nToplam:${isSoft ? " Belirsiz" : ""} ${yourcard.map(c => c.value).reduce((a, b) => b + a)}`
        options.embed = embed

        let components = message?.components || []
        while (components.length == 2 && components[0].components.length > 2) {
            components[0].components.pop()
        }

        if (options.isSplit === "first" && options.secondHand) {
            embed.description = "Bu ilk el."
            let pv = yourcard.map(c => c.value).reduce((a, b) => b + a)
            if ((pv === 9 || pv === 10 || pv === 11) && yourcard.length == 2) {
                let embed = options.embed
                let hitbtn = { label: "Vur", style: 1, custom_id: "discord-blackjack-hitbtn", type: 2 }
                let standbtn = { label: "Dur", style: 1, custom_id: "discord-blackjack-standbtn", type: 2 }
                let ddownbtn = { label: "Çift Düşüş", style: 1, custom_id: "discord-blackjack-ddownbtn", type: 2 }
                let splitbtn = { label: "Böl", style: 1, custom_id: "discord-blackjack-splitbtn", type: 2 }
                let cancelbtn = { label: "İptal", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }
                let row1 = { type: 1, components: [hitbtn, standbtn, ddownbtn] }
                let row2 = { type: 1, components: [cancelbtn] }
                let components = [row1]
                if (options.transition === "edit") {
                    if (options.commandType === "message") {
                        message = await message.edit({ embeds: [embed], components })
                    } else {
                        message = await message.edit({ embeds: [embed], components })
                    }
                } else {
                    if (options.commandType === "message") {
                        await message.delete()
                        message = await message.channel.send({ embeds: [embed], components })
                    } else {
                        if (!message.ephemeral) {
                            await message.delete()
                        }
                        message = await message.channel.send({ embeds: [embed], components })
                    }
                }
                return options.buttons ? this.buttonCollect(message, userId, yourcard, dealercard, DECK, options) : this.messageCollect(message, userId, yourcard, dealercard, DECK, options)
            }


        } else if (options.secondHand) {
            embed.description = "Bu ikinci el."
            let pv2 = yourcard.map(c => c.value).reduce((a, b) => b + a)
            if ((pv2 === 9 || pv2 === 10 || pv2 === 11) && yourcard.length == 2) {
                let embed = options.embed
                let hitbtn = { label: "Vur", style: 1, custom_id: "discord-blackjack-hitbtn", type: 2 }
                let standbtn = { label: "Dur", style: 1, custom_id: "discord-blackjack-standbtn", type: 2 }
                let ddownbtn = { label: "Çift Düşüş", style: 1, custom_id: "discord-blackjack-ddownbtn", type: 2 }
                let splitbtn = { label: "Böl", style: 1, custom_id: "discord-blackjack-splitbtn", type: 2 }
                let cancelbtn = { label: "İptal", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }
                let row1 = { type: 1, components: [hitbtn, standbtn, ddownbtn] }
                let row2 = { type: 1, components: [cancelbtn] }
                let components = [row1]
                if (options.transition === "edit") {
                    if (options.commandType === "message") {
                        message = await message.edit({ embeds: [embed], components })
                    } else {
                        message = await message.edit({ embeds: [embed], components })
                    }
                } else {
                    if (options.commandType === "message") {
                        await message.delete()
                        message = await message.channel.send({ embeds: [embed], components })
                    } else {
                        if (!message.ephemeral) {
                            await message.delete()
                        }
                        message = await message.channel.send({ embeds: [embed], components })
                    }
                }
                return options.buttons ? this.buttonCollect(message, userId, yourcard, dealercard, DECK, options) : this.messageCollect(message, userId, yourcard, dealercard, DECK, options)
            }
        }

        else {
            embed.description = embed.description
        }
        if (options.transition === "edit") {
            if (options.commandType === "message") {
                message = await message.edit({ embeds: [embed], components })
            } else {
                message = await message.edit({ embeds: [embed], components })
            }
        } else {
            if (options.commandType === "message") {
                await message.delete()
                message = await message.channel.send({ embeds: [embed], components })
            } else {
                if (!message.ephemeral) {
                    await message.delete()
                }
                message = await message.channel.send({ embeds: [embed], components })
            }
        }

        return options.buttons ? this.buttonCollect(message, userId, yourcard, dealercard, DECK, options) : this.messageCollect(message, userId, yourcard, dealercard, DECK, options)
    }

    async stand(message, userId, yourcard, dealercard, DECK, options) {
        let yourvalue = yourcard.map(c => c.value).reduce((a, b) => b + a)
        let dealervalue = dealercard.map(d => d.value).reduce((a, b) => b + a)
        let finalResult = {}
        let finalResult2 = {}


        if (options.isSplit === "first") {

            options.isSplit = "second";
            let dealerrank = [dealercard[0].rank, dealercard[1].rank]
            while (dealervalue < 17) {
                let newCard = DECK.pop()
                dealercard.push(newCard)
                dealerrank.push(newCard.rank)
                if (newCard.rank == "A") {
                    if (dealerrank.includes("A")) {
                        newCard.value = 1
                    } else {
                        newCard.value = 11
                    }
                }
                dealervalue += newCard.value
                if (dealervalue > 21 && dealerrank.includes("A")) {
                    let unu = 0
                    dealercard.forEach(e => {
                        if (e.rank == "A") {
                            dealercard[unu].value = 1
                            dealervalue = dealercard.map(d => d.value).reduce((a, b) => b + a)
                        }
                        unu++
                    })
                }
            }

            finalResult2 = await this.hit(message, userId, options.secondHand, dealercard, DECK, options)
            let yourvalue2 = finalResult2.ycard.map(c => c.value).reduce((a, b) => b + a)
            let yourcard2 = finalResult2.ycard
            let bj1 = false
            let bj2 = false
            let dbj1 = false
            let dbj2 = false
            if ((yourvalue === 21 && yourcard.length === 2) && ((dealervalue === 21 && dealercard.length != 2) || (dealervalue != 21))) {
                bj1 = true;
            }
            if ((yourvalue2 === 21 && yourcard2.length === 2) && ((dealervalue === 21 && dealercard.length != 2) || (dealervalue != 21))) {
                bj2 = true;
            }
            if ((dealervalue === 21 && dealercard.length === 2) && ((yourvalue === 21 && yourcard.length != 2) || (yourvalue != 21))) {
                dbj1 = true;
            }
            if ((dealervalue === 21 && dealercard.length === 2) && ((yourvalue2 === 21 && yourcard2.length != 2) || (yourvalue2 != 21))) {
                dbj2 = true;
            }

            if (options.isDoubleDown !== true) {

                if (yourvalue > 21 && yourvalue2 > 21) {
                    finalResult = { result: "SPLIT LOSE-LOSE", method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && bj2 == true) {
                    finalResult = { result: "SPLIT LOSE-BLACKJACK", method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, ycard2: finalResult2.ycard, dcard: dealercard }
                }

                else if (bj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT BLACKJACK-LOSE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && bj2 == true) {
                    finalResult = { result: `SPLIT BLACKJACK-BLACKJACK`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT LOSE-WIN`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT WIN-LOSE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT WIN-WIN`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT WIN-WIN`, method: `İlk El: Kazandın!\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT BLACKJACK-WIN`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && bj2 == true) {
                    finalResult = { result: `SPLIT WIN-BLACKJACK`, method: `İlk El: Kazandın!\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj1 == false)) {
                    finalResult = { result: `SPLIT LOSE-WIN`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT WIN-LOSE`, method: `İlk El: Kazandın!\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && dbj2 == true) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && dbj2 == true) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT WIN-LOSE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT LOSE-WIN`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT BLACKJACK-LOSE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && bj2 == true) {
                    finalResult = { result: `SPLIT LOSE-BLACKJACK`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-TIE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT TIE-LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT BLACKJACK-TIE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && bj2 == true) {
                    finalResult = { result: `SPLIT TIE-BLACKJACK`, method: `İlk El: Berabere!\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }


                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT WIN-TIE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT TIE-WIN`, method: `İlk El: Berabere!\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-TIE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && dbj2 == true) {
                    finalResult = { result: `SPLIT TIE-LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-TIE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT TIE-LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT TIE-TIE`, method: `İlk El: Berabere!\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && bj2 == true) {
                    finalResult = { result: `SPLIT WIN-WIN`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT WIN-WIN`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

            } else if (options.isDoubleDown == true && options.isFirstSplitDouble == true && options.isSecondSplitDouble != true) {

                if (yourvalue > 21 && yourvalue2 > 21) {
                    finalResult = { result: "SPLIT DOUBLE LOSE-LOSE", method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && bj2 == true) {
                    finalResult = { result: "SPLIT DOUBLE LOSE-BLACKJACK", method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, ycard2: finalResult2.ycard, dcard: dealercard }
                }

                else if (bj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-LOSE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-BLACKJACK`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-WIN`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE WIN-LOSE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE WIN-WIN`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-WIN`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT DOUBLE LACKJACK-WIN`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE WIN-BLACKJACK`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj1 == false)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-WIN`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE WIN-LOSE`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-LOSE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-WIN`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-LOSE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-BLACKJACK`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-TIE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE TIE-LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettiniz. Kazanmanız dileğiyle...`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-TIE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE TIE-BLACKJACK`, method: `İlk El: Berabere (Çift).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }


                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-TIE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE TIE-WIN`, method: `İlk El: Berabere (Çift).\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-TIE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE TIE-LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-TIE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE TIE-LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE TIE-TIE`, method: `İlk El: Berabere (Çift).\nİkinci El: Berabere!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE WIN-WIN`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El:  Blackjack yaparak kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE WIN-WIN`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Daha fazla puanla kazandın.`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }
            }
            else if (options.isDoubleDown == true && options.isFirstSplitDouble != true && options.isSecondSplitDouble == true) {


                if (yourvalue > 21 && yourvalue2 > 21) {
                    finalResult = { result: "SPLIT LOSE-DOUBLE LOSE", method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && bj2 == true) {
                    finalResult = { result: "SPLIT LOSE-DOUBLE BLACKJACK", method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, ycard2: finalResult2.ycard, dcard: dealercard }
                }

                else if (bj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT BLACKJACK-DOUBLE LOSE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && bj2 == true) {
                    finalResult = { result: `SPLIT BLACKJACK-DOUBLE BLACKJACK`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE WIN`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT WIN-DOUBLE LOSE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT WIN-DOUBLE WIN`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT WIN-DOUBLE WIN`, method: `İlk El: Kazandın!\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT BLACKJACK-DOUBLE WIN`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && bj2 == true) {
                    finalResult = { result: `SPLIT WIN-DOUBLE BLACKJACK`, method: `İlk El: Kazandın!\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj1 == false)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE WIN`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT WIN-DOUBLE LOSE`, method: `İlk El: Kazandın!\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && dbj2 == true) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && dbj2 == true) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT WIN-DOUBLE LOSE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE WIN`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT BLACKJACK-DOUBLE LOSE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && bj2 == true) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE BLACKJACK`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE TIE`, method: `İlk El: Kaybettiniz. Kazanmanız dileğiyle...\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT TIE-DOUBLE LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT BLACKJACK-DOUBLE TIE`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && bj2 == true) {
                    finalResult = { result: `SPLIT TIE-DOUBLE BLACKJACK`, method: `İlk El: Berabere!\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }


                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT WIN-DOUBLE TIE`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT TIE-DOUBLE WIN`, method: `İlk El: Berabere!\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE TIE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && dbj2 == true) {
                    finalResult = { result: `SPLIT TIE-DOUBLE LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT LOSE-DOUBLE TIE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT TIE-DOUBLE LOSE`, method: `İlk El: Berabere!\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT TIE-DOUBLE TIE`, method: `İlk El: Berabere!\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && bj2 == true) {
                    finalResult = { result: `SPLIT WIN-DOUBLE WIN`, method: `İlk El: Daha fazla puanla kazandın.\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT WIN-DOUBLE WIN`, method: `İlk El:  Blackjack yaparak kazandın.\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }
            }
            else if (options.isDoubleDown == true && options.isFirstSplitDouble == true && options.isSecondSplitDouble == true) {

                if (yourvalue > 21 && yourvalue2 > 21) {
                    finalResult = { result: "SPLIT DOUBLE LOSE-DOUBLE LOSE", method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && bj2 == true) {
                    finalResult = { result: "SPLIT DOUBLE LOSE-DOUBLE BLACKJACK", method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, ycard2: finalResult2.ycard, dcard: dealercard }
                }

                else if (bj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-DOUBLE LOSE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-DOUBLE BLACKJACK`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE WIN`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE LOSE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE WIN`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE WIN`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj2 == false)) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-DOUBLE WIN`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE BLACKJACK`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue > 21 && yourvalue2 <= 21 && bj1 == false)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE WIN`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: You won (Bot kaybetti) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21 && bj1 == false) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE LOSE`, method: `İlk El: You won (Bot kaybetti) (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE LOSE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE WIN`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-DOUBLE LOSE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE BLACKJACK`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE LOSE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (yourvalue > 21 && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE TIE`, method: `İlk El: Kaybettin (Başarısız) (Çift).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && yourvalue2 > 21) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettin (Başarısız) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE BLACKJACK-DOUBLE TIE`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE BLACKJACK`, method: `İlk El: Berabere (Çift).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }


                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE TIE`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE WIN`, method: `İlk El: Berabere (Çift).\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (dbj1 == true && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE TIE`, method: `İlk El: Kaybettin (Bot, Blackjack yaptı) (Çift).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && dbj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettin (Bot, Blackjack yaptı) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue > yourvalue && dealervalue <= 21) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE LOSE-DOUBLE TIE`, method: `İlk El: Kaybettin (Bot, daha fazlasına sahip) (Çift).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue > yourvalue2 && dealervalue <= 21)) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE LOSE`, method: `İlk El: Berabere (Çift).\nİkinci El: Kaybettin (Bot, daha fazlasına sahip) (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((dealervalue === yourvalue) && (dealervalue === yourvalue2)) {
                    finalResult = { result: `SPLIT DOUBLE TIE-DOUBLE TIE`, method: `İlk El: Berabere (Çift).\nİkinci El: Berabere (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if ((yourvalue <= 21 && bj1 == false && (dealervalue < yourvalue)) && bj2 == true) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE WIN`, method: `İlk El: Daha fazla puanla kazandın (Çift).\nİkinci El: Çifte blackjack yaparak kazandın!`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }

                else if (bj1 == true && (yourvalue2 <= 21 && bj2 == false && (dealervalue < yourvalue2))) {
                    finalResult = { result: `SPLIT DOUBLE WIN-DOUBLE WIN`, method: `İlk El: Çifte blackjack yaparak kazandın!\nİkinci El: Daha fazla puanla kazandın (Çift).`, ycard: yourcard, ycard2: yourcard2, dcard: dealercard }
                }
            }

            return finalResult
        }

        if (options.isSplit === "second") {

            options.isSplit = "done";
            if (options.isDoubleDown !== true) {
                if (yourvalue > 21) {
                    finalResult2 = { result: "LOSE", method: "Kaybettin", ycard: yourcard, dcard: dealercard }
                } else if (yourvalue === 21) {
                    finalResult2 = { result: "WIN", method: "Blackjack yaptın", ycard: yourcard, dcard: dealercard }
                } else if (yourvalue < 21 && dealervalue < yourvalue) {
                    finalResult2 = { result: "WIN", method: "Daha fazlasına sahipsin", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue > yourvalue && dealervalue > 21 && yourvalue < 21) {
                    finalResult2 = { result: "WIN", method: "Bot kaybetti", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue === 21 && yourvalue < 21) {
                    finalResult2 = { result: "LOSE", method: "Bot, Blackjack yaptı", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue > yourvalue && dealervalue < 21) {
                    finalResult2 = { result: "LOSE", method: "Bot, daha fazlasına sahip", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue === yourvalue) {
                    finalResult2 = { result: "TIE", method: "Berabere", ycard: yourcard, dcard: dealercard }
                }
            } else if (options.isDoubleDown === true) {
                if (yourvalue > 21) {
                    finalResult2 = { result: "DOUBLE LOSE", method: "Kaybettin", ycard: yourcard, dcard: dealercard }
                } else if (yourvalue === 21) {
                    finalResult2 = { result: "DOUBLE WIN", method: "Blackjack yaptın", ycard: yourcard, dcard: dealercard }
                } else if (yourvalue < 21 && dealervalue < yourvalue) {
                    finalResult2 = { result: "DOUBLE WIN", method: "Daha fazlasına sahipsin", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue > yourvalue && dealervalue > 21 && yourvalue < 21) {
                    finalResult2 = { result: "DOUBLE WIN", method: "Bot kaybetti", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue === 21 && yourvalue < 21) {
                    finalResult2 = { result: "DOUBLE LOSE", method: "Bot, Blackjack yaptı", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue > yourvalue && dealervalue < 21) {
                    finalResult2 = { result: "DOUBLE LOSE", method: "Bot, daha fazlasına sahip", ycard: yourcard, dcard: dealercard }
                } else if (dealervalue === yourvalue) {
                    finalResult2 = { result: "DOUBLE TIE", method: "Berabere", ycard: yourcard, dcard: dealercard }
                }
            }
            if (options.transition === "edit") {
                message = await message.edit({ embeds: message.embeds, components: [] })
                finalResult2.message = message
            } else {
                await message.delete()
            }
            return finalResult2
        } else {

            if ((dealervalue === 21 && dealercard.length === 2)) {
                if (options.hasInsurance == true) {
                    finalResult = { result: "INSURANCE PAYOUT", method: "Botun blackjack'ine karşı garanti aldınız. Paranız tekrardan size verildi!", ycard: yourcard, dcard: dealercard }
                    if (options.transition === "edit") {
                        message = await message.edit({ embeds: message.embeds, components: [] })
                        finalResult2.message = message
                    } else {
                        await message.delete()
                    }
                    return finalResult
                }
                else {
                    finalResult = { result: "LOSE", method: "Kaybettiniz. Kazanmanız dileğiyle... (Bot, Blackjack ile kazandı)", ycard: yourcard, dcard: dealercard }
                    if (options.transition === "edit") {
                        message = await message.edit({ embeds: message.embeds, components: [] })
                        finalResult2.message = message
                    } else {
                        await message.delete()
                    }
                    return finalResult
                }
            }

            else {
                let dealerrank = [dealercard[0].rank, dealercard[1].rank]
                let finalResult = {}
                while (dealervalue < 17) {
                    let newCard = DECK.pop()
                    dealercard.push(newCard)
                    dealerrank.push(newCard.rank)
                    if (newCard.rank == "A") {
                        if (dealerrank.includes("A")) {
                            newCard.value = 1
                        } else {
                            newCard.value = 11
                        }
                    }
                    dealervalue += newCard.value
                    if (dealervalue > 21 && dealerrank.includes("A")) {
                        let unu = 0
                        dealercard.forEach(e => {
                            if (e.rank == "A") {
                                dealercard[unu].value = 1
                                dealervalue = dealercard.map(d => d.value).reduce((a, b) => b + a)
                            }
                            unu++
                        })
                    }
                }

                if (options.hasInsurance == true) {
                    if (yourvalue > 21) {
                        finalResult = { result: "INSURANCE LOSE", method: "Kaybettiniz. Kazanmanız dileğiyle...", ycard: yourcard, dcard: dealercard }
                    } else if ((yourvalue <= 21 && (dealervalue < yourvalue))) {
                        finalResult = { result: "INSURANCE WIN", method: "Daha fazla puanla kazandın.", ycard: yourcard, dcard: dealercard }
                    } else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21)) {
                        finalResult = { result: "INSURANCE WIN", method: "Kazandın!", ycard: yourcard, dcard: dealercard }
                    } else if ((dealervalue > yourvalue && dealervalue <= 21)) {
                        finalResult = { result: "INSURANCE LOSE", method: "Kaybettin (Bot, daha fazlasına sahip).", ycard: yourcard, dcard: dealercard }
                    } else if (dealervalue === yourvalue) {
                        finalResult = { result: "INSURANCE TIE", method: "Berabere!", ycard: yourcard, dcard: dealercard }
                    }
                }
                else if (options.hasInsurance !== true) {
                    if (options.isDoubleDown !== true) {
                        if (yourvalue > 21) {
                            finalResult = { result: "LOSE", method: "Kaybettiniz. Kazanmanız dileğiyle...", ycard: yourcard, dcard: dealercard }
                        } else if ((yourvalue <= 21 && (dealervalue < yourvalue))) {
                            finalResult = { result: "WIN", method: "Daha fazla puanla kazandın.", ycard: yourcard, dcard: dealercard }
                        } else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21)) {
                            finalResult = { result: "WIN", method: "Kazandın!", ycard: yourcard, dcard: dealercard }
                        } else if ((dealervalue > yourvalue && dealervalue <= 21)) {
                            finalResult = { result: "LOSE", method: "Kaybettin (Bot, daha fazlasına sahip).", ycard: yourcard, dcard: dealercard }
                        } else if (dealervalue === yourvalue) {
                            finalResult = { result: "TIE", method: "Berabere!", ycard: yourcard, dcard: dealercard }
                        }
                    } else if (options.isDoubleDown === true) {
                        if (yourvalue > 21) {
                            finalResult = { result: "DOUBLE LOSE", method: "Double: Kaybettin.", ycard: yourcard, dcard: dealercard }
                        } else if ((yourvalue <= 21 && (dealervalue < yourvalue))) {
                            finalResult = { result: "DOUBLE WIN", method: "Double: Daha fazla puanla kazandın.", ycard: yourcard, dcard: dealercard }
                        } else if ((dealervalue > yourvalue && dealervalue > 21 && yourvalue <= 21)) {
                            finalResult = { result: "DOUBLE WIN", method: "Double: Kazandın!", ycard: yourcard, dcard: dealercard }
                        } else if ((dealervalue > yourvalue && dealervalue <= 21)) {
                            finalResult = { result: "DOUBLE LOSE", method: "Double: Kaybettin (Bot, daha fazlasına sahip).", ycard: yourcard, dcard: dealercard }
                        } else if (dealervalue === yourvalue) {
                            finalResult = { result: "DOUBLE TIE", method: "Double: Berabere!", ycard: yourcard, dcard: dealercard }
                        }
                    }
                }

                if (options.transition === "edit") {
                    message = await message.edit({ embeds: message.embeds, components: [] })
                    finalResult.message = message
                } else {
                    await message.delete()
                }
                return finalResult
            }
        }
    }


    async doubledown(message, userId, yourcard, dealercard, DECK, options) {
        options.isDoubleDown = true
        if (options.isSplit === "first") {
            options.isFirstSplitDouble = true
        }
        if (options.isSplit === "second") {
            options.isSecondSplitDouble = true
        }
        let isSoft = false
        let newCard = DECK.pop()
        if (newCard.rank === "A") {
            if (yourcard.map(c => c.rank).includes("A")) {
                newCard.value = 1
            } else {
                newCard.value = 11
            }
        }

        yourcard.push(newCard)

        if (yourcard.map(c => c.rank).includes("A") && yourcard.find(c => c.rank === "A" && c.value === 11)) {
            isSoft = true
        }

        if (yourcard.map(c => c.value).reduce((a, b) => b + a) > 21 && isSoft == true) {
            isSoft = false
            for (let y = 0; y < yourcard.length; y++) {
                if (yourcard[y].rank === "A") {
                    yourcard[y].value = 1
                }
            }
        }

        return this.stand(message, userId, yourcard, dealercard, DECK, options)
    }

    async insurance(message, userId, yourcard, dealercard, DECK, options) {
        options.hasInsurance = true
        let dealervalue = dealercard.map(c => c.value).reduce((a, b) => b + a)

        if (dealervalue === 21) {
            return this.stand(message, userId, yourcard, dealercard, DECK, options)
        }

        else {
            let embed = options.embed
            let hitbtn = { label: "Vur", style: 1, custom_id: "discord-blackjack-hitbtn", type: 2 }
            let standbtn = { label: "Dur", style: 1, custom_id: "discord-blackjack-standbtn", type: 2 }
            let ddownbtn = { label: "Çift Düşüş", style: 1, custom_id: "discord-blackjack-ddownbtn", type: 2 }
            let splitbtn = { label: "Böl", style: 1, custom_id: "discord-blackjack-splitbtn", type: 2 }
            let cancelbtn = { label: "İptal", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }
            let row1 = { type: 1, components: [hitbtn, standbtn] }
            let row2 = { type: 1, components: [cancelbtn] }
            let components = [row1]
            while (components.length == 2 && components[0].components.length > 2) {
                components[0].components.pop()
            }
            if (options.transition === "edit") {
                if (options.commandType === "message") {
                    message = await message.edit({ embeds: [embed], components })
                } else {
                    message = await message.edit({ embeds: [embed], components })
                }
            } else {
                if (options.commandType === "message") {
                    await message.delete()
                    message = await message.channel.send({ embeds: [embed], components })
                } else {
                    if (!message.ephemeral) {
                        await message.delete()
                    }
                    message = await message.channel.send({ embeds: [embed], components })
                }
            }
            return options.buttons ? this.buttonCollect(message, userId, yourcard, dealercard, DECK, options) : this.messageCollect(message, userId, yourcard, dealercard, DECK, options)
        }
    }

    async noinsurance(message, userId, yourcard, dealercard, DECK, options) {
        options.hasInsurance = false
        let dealervalue = dealercard.map(c => c.value).reduce((a, b) => b + a)

        if (dealervalue === 21) {
            return this.stand(message, userId, yourcard, dealercard, DECK, options)
        }

        else {
            let embed = options.embed
            let hitbtn = { label: "Vur", style: 1, custom_id: "discord-blackjack-hitbtn", type: 2 }
            let standbtn = { label: "Dur", style: 1, custom_id: "discord-blackjack-standbtn", type: 2 }
            let ddownbtn = { label: "Çift Düşüş", style: 1, custom_id: "discord-blackjack-ddownbtn", type: 2 }
            let splitbtn = { label: "Böl", style: 1, custom_id: "discord-blackjack-splitbtn", type: 2 }
            let cancelbtn = { label: "İptal", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }
            let row1 = { type: 1, components: [hitbtn, standbtn] }
            let row2 = { type: 1, components: [cancelbtn] }
            let components = [row1]
            while (components.length == 2 && components[0].components.length > 2) {
                components[0].components.pop()
            }
            if (options.transition === "edit") {
                if (options.commandType === "message") {
                    message = await message.edit({ embeds: [embed], components })
                } else {
                    message = await message.edit({ embeds: [embed], components })
                }
            } else {
                if (options.commandType === "message") {
                    await message.delete()
                    message = await message.channel.send({ embeds: [embed], components })
                } else {
                    if (!message.ephemeral) {
                        await message.delete()
                    }
                    message = await message.channel.send({ embeds: [embed], components })
                }
            }
            return options.buttons ? this.buttonCollect(message, userId, yourcard, dealercard, DECK, options) : this.messageCollect(message, userId, yourcard, dealercard, DECK, options)
        }
    }

    async split(message, userId, yourcard, dealercard, DECK, options) {
        options.isSplit = "first"
        let yourcard2 = [yourcard.pop()]

        if (yourcard[0].rank === "A") {
            yourcard[0].value = 11
        }

        if (yourcard2[0].rank === "A") {
            yourcard2[0].value = 11
        }

        options.secondHand = yourcard2

        return this.hit(message, userId, yourcard, dealercard, DECK, options)

    }

    async cancel(message, userId, yourcard, dealercard, DECK, options) {
        if (options.transition === "edit") {
            return {
                result: "CANCEL",
                method: "None",
                ycard: yourcard,
                dcard: dealercard,
                message: message
            }
        } else {
            return {
                result: "CANCEL",
                method: "None",
                ycard: yourcard,
                dcard: dealercard
            }
        }

    }
}

module.exports = Collect
