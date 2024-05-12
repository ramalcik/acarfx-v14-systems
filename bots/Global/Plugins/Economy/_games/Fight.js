const data = new Set();
const Discord = require('discord.js');
const {genEmbed} = require('../../../Init/Embed');
let { ButtonStyle } = require("discord.js")
const functions = module.exports = {
	getRandomString: function(length) {
		const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(
				Math.floor(Math.random() * randomChars.length),
			);
		}
		return result;
	},
	getRandomSentence: function(length) {
		const word = [];
		for (let i = 0; i < length; i++) {
			word.push(words[Math.floor(Math.random() * words.length)]);
		}
		return word;
	},
	shuffleString: function(string) {
		const str = string.split('');
		const length = str.length;
		for (let i = length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const tmp = str[i];
			str[i] = str[j];
			str[j] = tmp;
		}
		return str.join('');
	},
}

module.exports = async (options) => {
	
	if (!options.message) {
		throw new Error('Weky Error: message argument was not specified.');
	}
	if (typeof options.message !== 'object') {
		throw new TypeError('Weky Error: Invalid Discord Message was provided.');
	}

	if (!options.opponent) {
		throw new Error('Weky Error: opponent argument was not specified.');
	}
	if (typeof options.opponent !== 'object') {
		throw new TypeError('Weky Error: Invalid Discord User was provided.');
	}

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') {
		throw new TypeError('Weky Error: embed must be an object.');
	}

	if (!options.embed.title) {
		options.embed.title = 'Fight | Weky Development';
	}
	if (typeof options.embed.title !== 'string') {
		throw new TypeError('Weky Error: embed title must be a string.');
	}

	if (!options.embed.color) {
		options.embed.color = functions.randomHexColor();
	}
	if (typeof options.embed.color !== 'string') {
		throw new TypeError('Weky Error: embed color must be a string.');
	}

	if (!options.embed.footer) {
		options.embed.footer = '©️ Weky Development';
	}
	if (typeof options.embed.footer !== 'string') {
		throw new TypeError('Weky Error: embed footer must be a string.');
	}

	if (!options.embed.timestamp) {
		options.embed.timestamp = true;
	}
	if (typeof options.embed.timestamp !== 'boolean') {
		throw new TypeError('Weky Error: setTimestamp must be a boolean.');
	}

	if (!options.buttons) options.buttons = {};
	if (typeof options.buttons !== 'object') {
		throw new TypeError('Weky Error: buttons must be an object.');
	}

	if (!options.buttons.hit) {
		options.buttons.hit = 'Hit';
	}
	if (typeof options.buttons.hit !== 'string') {
		throw new Error('Weky Error: hit button text must be a string.');
	}

	if (!options.buttons.heal) {
		options.buttons.heal = 'Heal';
	}
	if (typeof options.buttons.heal !== 'string') {
		throw new Error('Weky Error: heal button text must be a string.');
	}

	if (!options.buttons.cancel) {
		options.buttons.cancel = 'Stop';
	}
	if (typeof options.buttons.cancel !== 'string') {
		throw new Error('Weky Error: cancel button text must be a string.');
	}

	if (!options.buttons.accept) {
		options.buttons.accept = 'Accept';
	}
	if (typeof options.buttons.accept !== 'string') {
		throw new Error('Weky Error: accept button text must be a string.');
	}

	if (!options.buttons.deny) {
		options.buttons.deny = 'Deny';
	}
	if (typeof options.buttons.deny !== 'string') {
		throw new Error('Weky Error: deny button text must be a string.');
	}

	if (!options.acceptMessage) {
		options.acceptMessage =
			'<@{{challenger}}> has challenged <@{{opponent}}> for a fight!';
	}
	if (typeof options.acceptMessage !== 'string') {
		throw new Error('Weky Error: acceptMessage must be a string.');
	}

	if (!options.winMessage) {
		options.winMessage = 'GG, <@{{winner}}> won the fight!';
	}
	if (typeof options.winMessage !== 'string') {
		throw new TypeError('Weky Error: winMessage must be a string.');
	}

	if (!options.endMessage) {
		options.endMessage =
			'<@{{opponent}}> didn\'t answer in time. So, I dropped the game!';
	}
	if (typeof options.endMessage !== 'string') {
		throw new TypeError('Weky Error: endMessage must be a string.');
	}

	if (!options.cancelMessage) {
		options.cancelMessage = '<@{{opponent}}> refused to have a fight with you!';
	}
	if (typeof options.cancelMessage !== 'string') {
		throw new TypeError('Weky Error: cancelMessage must be a string.');
	}

	if (!options.fightMessage) {
		options.fightMessage = '{{player}} you go first!';
	}
	if (typeof options.fightMessage !== 'string') {
		throw new TypeError('Weky Error: fightMessage must be a string.');
	}

	if (!options.othersMessage) {
		options.othersMessage = 'Only {{author}} can use the buttons!';
	}
	if (typeof options.othersMessage !== 'string') {
		throw new TypeError('Weky Error: othersMessage must be a string.');
	}

	if (!options.opponentsTurnMessage) {
		options.opponentsTurnMessage = 'Please wait for your opponents move!';
	}
	if (typeof options.opponentsTurnMessage !== 'string') {
		throw new TypeError('Weky Error: opponentsTurnMessage must be a string.');
	}

	if (!options.highHealthMessage) {
		options.highHealthMessage = 'You cannot heal if your HP is above 80!';
	}
	if (typeof options.highHealthMessage !== 'string') {
		throw new TypeError('Weky Error: highHealthMessage must be a string.');
	}

	if (!options.lowHealthMessage) {
		options.lowHealthMessage =
			'You cannot cancel the fight if your HP is below 50!';
	}
	if (typeof options.lowHealthMessage !== 'string') {
		throw new TypeError('Weky Error: lowHealthMessage must be a string.');
	}

	if (!options.returnWinner) options.returnWinner = false;
	if (typeof options.returnWinner !== 'boolean') {
		throw new TypeError('Weky Error: buttonText must be a boolean.');
	}

	if (data.has(options.message.author.id) || data.has(options.opponent.id)) {
		return options.message.react(options.message.guild.emojiGöster(emojiler.Iptal)).catch(err => {});
	}
	data.add(options.message.author.id);
	data.add(options.opponent.id);

	const id1 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const id2 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const id3 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const oppenent = options.opponent
	const challenger = options.message.author;
	if (oppenent.bot || oppenent.id === challenger.id) return options.message.react(options.message.guild.emojiGöster(emojiler.Iptal)).catch(err => {});
	let acceptbutton = new Discord.ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel(options.buttons.accept)
		.setCustomId("accept")
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);
	let denybutton = new Discord.ButtonBuilder()
		.setStyle(Discord.ButtonStyle.Danger)
		.setLabel(options.buttons.deny)
		.setCustomId("deny")
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);;
	let component = new Discord.ActionRowBuilder().addComponents([
		acceptbutton,
		denybutton,
	]);
	const embed = new genEmbed()

		.setDescription(
			options.acceptMessage
				.replace('{{challenger}}', challenger.id)
				.replace('{{opponent}}', oppenent.id),
		)

	const question = await options.message.reply({
		embeds: [embed],
		components: [component],
	});

	const Collector = await question.createMessageComponentCollector({
		filter: (fn) => fn,
		time: 60000,
	});

	Collector.on('collect', async (_btn) => {
		if (_btn.member.id !== oppenent.id) {
			return _btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					`<@${oppenent.id}>`,
				),
				ephemeral: true,
			});
		}

		await _btn.deferUpdate();

		if (_btn.customId === 'deny') {
			acceptbutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Secondary)
				.setLabel(options.buttons.accept)
				.setCustomId("accept")
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);;
			denybutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Danger)
				.setLabel(options.buttons.deny)
				.setCustomId("deny")
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);;
			component = new Discord.ActionRowBuilder().addComponents([
				acceptbutton,
				denybutton,
			]);
			const emd = new genEmbed()
		
				.setDescription(
					options.cancelMessage.replace('{{opponent}}', oppenent.id),
				)
				
				.setColor(options.embed.color);
			Collector.stop();
			data.delete(options.opponent.id);
			data.delete(options.message.author.id);
			return question.edit({
				embeds: [emd],
				components: [],
			});
		} else if (_btn.customId === 'accept') {
			Collector.stop();
            await client.Economy.updateBalance(challenger.id, options.bahis, "remove", 1)
            await client.Economy.updateBalance(oppenent.id, options.bahis, "remove", 1)
			const challengerHealth = 100;
			const oppenentHealth = 100;
			const challengerLastAttack = 'heal';
			const oppenentLastAttack = 'heal';
			const gameData = [
				{
					member: challenger,
					health: challengerHealth,
					lastAttack: challengerLastAttack,
				},
				{
					member: oppenent,
					health: oppenentHealth,
					lastAttack: oppenentLastAttack,
				},
			];
			let player = Math.floor(Math.random() * gameData.length);
			let btn1 = new Discord.ButtonBuilder()
				.setLabel(options.buttons.hit)
				.setCustomId(id1)
                .setEmoji("1048233006701228112")
				.setStyle(ButtonStyle.Secondary);
			let btn2 = new Discord.ButtonBuilder()
				.setLabel(options.buttons.heal)
                .setEmoji("1048232975042629702")
				.setCustomId(id2)
				.setStyle(ButtonStyle.Secondary);
			let btn3 = new Discord.ButtonBuilder()
				.setLabel(options.buttons.cancel)
				.setCustomId(id3)
				.setStyle(ButtonStyle.Danger);
			let row = new Discord.ActionRowBuilder()
				.addComponents(btn1)
				.addComponents(btn2)
				.addComponents(btn3);
			const _embed = new genEmbed()
		
				.setDescription(
					options.fightMessage.replace('{{player}}', gameData[player].member),
				)
				
				.setColor(options.embed.color);
	
			question.edit({
				embeds: [_embed],
				components: [row],
			});
			const checkHealth = (member) => {
				if (gameData[member].health <= 0) return true;
				else return false;
			};
			const gameCollector = question.createMessageComponentCollector((fn) => fn);
			gameCollector.on('collect', async (msg) => {
				if (gameData.some((x) => x.member.id === msg.member.id)) {
					if (!checkHealth(player)) {
						const btn = msg.member;
						if (msg.customId === id1) {
							if (btn.id !== gameData[player].member.id) {
								return msg.reply({
									content: options.opponentsTurnMessage,
									ephemeral: true,
								});
							}
							await msg.deferUpdate();
							let randNumb =
								Math.floor(Math.random() * parseInt(options.dmgMax)) +
									parseInt(options.dmgMin) ||
								Math.floor(Math.random() * 15) + 4;
							const tempPlayer = (player + 1) % 2;
							if (gameData[tempPlayer].lastAttack === 'heal') {
								randNumb = Math.floor(randNumb / 2);
							}
							gameData[tempPlayer].health -= randNumb;
							gameData[player].lastAttack = 'attack';
							if (gameData[player].member.id == options.message.author.id) {
								const __embed = new genEmbed()
							
									.setDescription(
										`**Kazanılacak Ödül**: \` ${options.ödül} ${options.parabirim} Parası \`
Sıra sende **${gameData[tempPlayer].member.user.username}**

${gameData[player].member.username} (${gameData[player].health} HP) (:punch:) 
**${gameData[tempPlayer].member.user.username}** (${gameData[tempPlayer].health} HP)

${gameData[player].member.username} üyesi saldırıyı seçti!
Savaş devam ediyor...`,
									)
									
									.setColor(options.embed.color);
								if (options.embed.timestamp) {
									
								}
								question.edit({
									embeds: [__embed],
									components: [row],
								});
							} else if (gameData[player].member.id == options.opponent.id) {
								const __embed = new genEmbed()
							
									.setDescription(
										`**Kazanılacak Ödül**: \` ${options.ödül} ${options.parabirim} Parası \`
Sıra sende **${gameData[tempPlayer].member.username}**

**${gameData[tempPlayer].member.username}** (${gameData[tempPlayer].health} HP) 
${gameData[player].member.user.username} (${gameData[player].health} HP) (:punch:)

${gameData[player].member.user.username} üyesi saldırıyı seçti!
Savaş devam ediyor...
`,
									)
									
									.setColor(options.embed.color);
								if (options.embed.timestamp) {
									
								}
								question.edit({
									embeds: [__embed],
									components: [row],
								});
							}
							player = (player + 1) % 2;
						} else if (msg.customId === id2) {
							if (btn.id !== gameData[player].member.id) {
								return msg.reply({
									content: options.opponentsTurnMessage,
									ephemeral: true,
								});
							}
							if (gameData[player].health > 80) {
								return msg.reply({
									content: options.highHealthMessage,
									ephemeral: true,
								});
							} else {
								await msg.deferUpdate();
								let randNumb =
									Math.floor(Math.random() * parseInt(options.healMax)) +
										parseInt(options.healMin) ||
									Math.floor(Math.random() * 10) + 4;
								const tempPlayer = (player + 1) % 2;
								if (gameData[tempPlayer].lastAttack === 'heal') {
									randNumb = Math.floor(randNumb / 2);
								}
								gameData[player].health += randNumb;
								gameData[player].lastAttack = 'heal';
								if (gameData[player].member.id == options.message.author.id) {
									const __embed = new genEmbed()
								
										.setDescription(
											`**Kazanılacak Ödül**: \` ${options.ödül} ${options.parabirim} Parası \`
Sıra sende **${gameData[tempPlayer].member.user.username}**

${gameData[player].member.username} (${gameData[player].health} HP + :hearts:)  
**${gameData[tempPlayer].member.user.username}** (${gameData[tempPlayer].health} HP)

${gameData[player].member.username} üyesi savun ve iyileşi seçti!
Savaş devam ediyor...`,
										)
										
										.setColor(options.embed.color);
									question.edit({
										embeds: [__embed],
										components: [row],
									});
								} else if (gameData[player].member.id == options.opponent.id) {
									const __embed = new genEmbed()
								
										.setDescription(
`**Kazanılacak Ödül**: \` ${options.ödül} ${options.parabirim} Parası \`
Sıra sende **${gameData[tempPlayer].member.username}**

**${gameData[tempPlayer].member.username}** (${gameData[tempPlayer].health} HP) 
${gameData[player].member.user.username} (${gameData[player].health} HP + :hearts:)

${gameData[player].member.user.username} üyesi savun ve iyileşi seçti!
Savaş devam ediyor...`,
										)
										
										.setColor(options.embed.color);
									question.edit({
										embeds: [__embed],
										components: [row],
									});
								}
								player = (player + 1) % 2;
							}
						} else if (msg.customId === id3) {
							if (btn.id !== gameData[player].member.id) {
								return msg.reply({
									content: options.opponentsTurnMessage,
									ephemeral: true,
								});
							}
							if (gameData[player].health < 50) {
								return msg.reply({
									content: options.lowHealthMessage,
									ephemeral: true,
								});
							} else {
								await msg.deferUpdate();
								btn1 = new Discord.ButtonBuilder()
									.setLabel(options.buttons.hit)
									.setCustomId(id1)
                                    .setEmoji("1048233006701228112")
									.setStyle(ButtonStyle.Secondary)
									.setDisabled();
								btn2 = new Discord.ButtonBuilder()
									.setLabel(options.buttons.heal)
									.setCustomId(id2)
                                    .setEmoji("1048232975042629702")
									.setStyle(ButtonStyle.Secondary)
									.setDisabled();
								btn3 = new Discord.ButtonBuilder()
									.setLabel(options.buttons.cancel)
									.setCustomId(id3)
									.setStyle(ButtonStyle.Danger)
									.setDisabled();
								row = new Discord.ActionRowBuilder()
									.addComponents(btn1)
									.addComponents(btn2)
									.addComponents(btn3);
								gameCollector.stop();
								data.delete(options.opponent.id);
								data.delete(options.message.author.id);
								const __embed = new genEmbed()
							
									.setDescription(
										options.cancelMessage.replace(
											'{{opponent}}',
											gameData[player].member.id,
										),
									)
									
									.setColor(options.embed.color);
                                    await client.Economy.updateBalance(gameData[player].member.id, options.bahis, "add", 1)
								question.edit({
									embeds: [__embed],
									components: [],
								});
							}
						}
						if (checkHealth(player)) {
							btn1 = new Discord.ButtonBuilder()
								.setLabel(options.buttons.hit)
								.setCustomId(id1)
                                .setEmoji("1048233006701228112")
								.setStyle(ButtonStyle.Secondary)
								.setDisabled();
							btn2 = new Discord.ButtonBuilder()
								.setLabel(options.buttons.heal)
								.setCustomId(id2)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("1048232975042629702")
								.setDisabled();
							btn3 = new Discord.ButtonBuilder()
								.setLabel(options.buttons.cancel)
								.setCustomId(id3)
								.setStyle(ButtonStyle.Danger)
								.setDisabled();
							row = new Discord.ActionRowBuilder()
								.addComponents(btn1)
								.addComponents(btn2)
								.addComponents(btn3);
							gameCollector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							const tempPlayer = (player + 1) % 2;
							const __embed = new genEmbed()
						
								.setDescription(
									options.winMessage.replace(
										'{{winner}}',
										gameData[tempPlayer].member.id,
									),
								)
								.setColor(options.embed.color);
                                await client.Economy.updateBalance(gameData[tempPlayer].member.id, options.ödül, "add", 1)
                                if (options.returnWinner) {
								if (!options.gameID) {
									throw new Error(
										'Weky Error: gameID argument was not specified.',
									);
								}
								if (
									typeof options.gameID !== 'string'
								) {
									throw new TypeError(
										'Weky Error: gameID must be a string.',
									);
								}
		


							}
							question.edit({
								embeds: [__embed],
								components: [row],
							});
						}
					} else {
						btn1 = new Discord.ButtonBuilder()
							.setLabel(options.buttons.hit)
							.setCustomId(id1)
							.setStyle(ButtonStyle.Secondary)
                            .setEmoji("1048233006701228112")
							.setDisabled();
						btn2 = new Discord.ButtonBuilder()
							.setLabel(options.buttons.heal)
                            .setEmoji("1048232975042629702")
							.setCustomId(id2)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled();
						btn3 = new Discord.ButtonBuilder()
							.setLabel(options.buttons.cancel)
							.setCustomId(id3)
							.setStyle(ButtonStyle.Danger)
							.setDisabled();
						gameCollector.stop();
						data.delete(options.opponent.id);
						data.delete(options.message.author.id);
						const tempPlayer = (player + 1) % 2;
						const __embed = new genEmbed()
					
							.setDescription(
								options.winMessage.replace(
									'{{winner}}',
									gameData[tempPlayer].member.id,
								),
							)
							await client.Economy.updateBalance(gameData[tempPlayer].member.id, options.ödül, "add", 1)
							.setColor(options.embed.color);
						if (options.returnWinner) {
							if (!options.gameID) {
								throw new Error(
									'Weky Error: gameID argument was not specified.',
								);
							}
							if (typeof options.gameID !== 'string') {
								throw new TypeError('Weky Error: gameID must be a string.');
							}
						}
						question.edit({
							embeds: [__embed],
							components: [row],
						});
					}
				} else {
					return msg.reply({
						content: options.othersMessage.replace(
							'{{author}}',
							`<@${challenger.id}> ve <@${oppenent.id}>`,
						),
						ephemeral: true,
					});
				}
			});
		}
	});
	Collector.on('end', async (msg, reason) => {
		if (reason === 'time') {
			acceptbutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Secondary)
				.setLabel(options.buttons.accept)
				.setCustomId("accept")
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);;
			denybutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Danger)
				.setLabel(options.buttons.deny)
				.setCustomId("deny")
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);;
			component = new Discord.ActionRowBuilder().addComponents([
				acceptbutton,
				denybutton,
			]);
			const _embed = new genEmbed()
		
				.setDescription(options.endMessage.replace('{{opponent}}', oppenent.id))
				
				.setColor(options.embed.color);

			data.delete(options.opponent.id);
			data.delete(options.message.author.id);
			return question.edit({
				embeds: [_embed],
				components: [],
			});
		}
	});
};