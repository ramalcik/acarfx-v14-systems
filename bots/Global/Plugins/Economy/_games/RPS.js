const data = new Set();
const {genEmbed} = require('../../../Init/Embed');
const Discord = require('discord.js');
let { ButtonStyle } = Discord;
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
		options.embed.title = 'Rock Paper Scissors | Weky Development';
	}
	if (typeof options.embed.title !== 'string') {
		throw new TypeError('Weky Error: embed title must be a string.');
	}

	if (!options.embed.description) {
		options.embed.description =
			'Press the button below to choose your element.';
	}
	if (typeof options.embed.description !== 'string') {
		throw new TypeError('Weky Error: embed description must be a string.');
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

	if (!options.buttons.rock) {
		options.buttons.rock = 'Rock';
	}
	if (typeof options.buttons.rock !== 'string') {
		throw new Error('Weky Error: rock button text must be a string.');
	}

	if (!options.buttons.paper) {
		options.buttons.paper = 'Paper';
	}
	if (typeof options.buttons.paper !== 'string') {
		throw new Error('Weky Error: paper button text must be a string.');
	}

	if (!options.buttons.scissors) {
		options.buttons.scissors = 'Scissors';
	}
	if (typeof options.buttons.scissors !== 'string') {
		throw new Error('Weky Error: scissors button text must be a string.');
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

	if (!options.time) options.time = 60000;
	if (parseInt(options.time) < 10000) {
		throw new Error(
			'Weky Error: time argument must be greater than 10 Seconds (in ms i.e. 10000).',
		);
	}
	if (typeof options.time !== 'number') {
		throw new TypeError('Weky Error: time must be a number.');
	}

	if (!options.acceptMessage) {
		options.acceptMessage =
			'<@{{challenger}}> has challenged <@{{opponent}}> for a game of Rock Paper and Scissors!';
	}
	if (typeof options.acceptMessage !== 'string') {
		throw new Error('Weky Error: acceptMessage must be a string.');
	}

	if (!options.winMessage) {
		options.winMessage = 'GG, <@{{winner}}> won!';
	}
	if (typeof options.winMessage !== 'string') {
		throw new TypeError('Weky Error: winMessage must be a string.');
	}

	if (!options.drawMessage) {
		options.drawMessage = 'This game is deadlock!';
	}
	if (typeof options.drawMessage !== 'string') {
		throw new TypeError('Weky Error: drawMessage must be a string.');
	}

	if (!options.endMessage) {
		options.endMessage =
			'<@{{opponent}}> didn\'t answer in time. So, I dropped the game!';
	}
	if (typeof options.endMessage !== 'string') {
		throw new TypeError('Weky Error: endMessage must be a string.');
	}

	if (!options.timeEndMessage) {
		options.timeEndMessage =
			'Both of you didn\'t pick something in time. So, I dropped the game!';
	}
	if (typeof options.timeEndMessage !== 'string') {
		throw new TypeError('Weky Error: timeEndMessage must be a string.');
	}

	if (!options.cancelMessage) {
		options.cancelMessage =
			'<@{{opponent}}> refused to have a game of Rock Paper and Scissors with you!';
	}
	if (typeof options.cancelMessage !== 'string') {
		throw new TypeError('Weky Error: cancelMessage must be a string.');
	}

	if (!options.choseMessage) {
		options.choseMessage = 'You picked {{emoji}}';
	}
	if (typeof options.choseMessage !== 'string') {
		throw new TypeError('Weky Error: choseMessage must be a string.');
	}

	if (!options.noChangeMessage) {
		options.noChangeMessage = 'You cannot change your selection!';
	}
	if (typeof options.noChangeMessage !== 'string') {
		throw new TypeError('Weky Error: noChangeMessage must be a string.');
	}

	if (!options.othersMessage) {
		options.othersMessage = 'Only {{author}} can use the buttons!';
	}
	if (typeof options.othersMessage !== 'string') {
		throw new TypeError('Weky Error: othersMessage must be a string.');
	}

	if (!options.returnWinner) options.returnWinner = false;
	if (typeof options.returnWinner !== 'boolean') {
		throw new TypeError('Weky Error: buttonText must be a boolean.');
	}

	if (data.has(options.message.author.id) || data.has(options.opponent.id)) {
		return;
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

	if (
		options.opponent.bot ||
		options.opponent.id === options.message.author.id
	) {
		return;
	}
	let acceptbutton = new Discord.ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel(options.buttons.accept)
     
		.setCustomId('accept')
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);
	let denybutton = new Discord.ButtonBuilder()
		.setStyle(ButtonStyle.Danger)
		.setLabel(options.buttons.deny)
		.setCustomId('deny')
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);
	let component = new Discord.ActionRowBuilder().addComponents([
		acceptbutton,
		denybutton,
	]);
	const embed = new genEmbed()
		
		.setDescription(
			options.acceptMessage
				.replace('{{challenger}}', options.message.author.id)
                .replace('{{ödül}}', options.ödül)
                .replace('{{bahis}}', options.bahis)
				.replace('{{opponent}}', options.opponent.id),
		)
		
		.setColor(options.embed.color);
	const question = await options.message.reply({
		embeds: [embed],
		components : [component],
	});
	const Collector = await question.createMessageComponentCollector({
		filter: (fn) => fn,
		time: options.time,
	});
	Collector.on('collect', async (_btn) => {
		if (_btn.member.id !== options.opponent.id) {
			return _btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					`<@${options.opponent.id}>`,
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
				.setCustomId('accept')
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);
			denybutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Danger)
				.setLabel(options.buttons.deny)
				.setCustomId('deny')
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);
			component = new Discord.ActionRowBuilder().addComponents([
				acceptbutton,
				denybutton,
			]);
			const emd = new genEmbed()
				
				.setDescription(
					options.cancelMessage.replace('{{opponent}}', options.opponent.id),
				)
				
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				
			}
			Collector.stop();
			data.delete(options.opponent.id);
			data.delete(options.message.author.id);
			return question.edit({
				embeds: [emd],
				components : [component],
			});
		} else if (_btn.customId === 'accept') {
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "remove", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "remove", 1)
			Collector.stop();
			let scissorsbtn = new Discord.ButtonBuilder()
				.setCustomId(id1)
				.setLabel(options.buttons.scissors)
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('✌️');
			let rockbtn = new Discord.ButtonBuilder()
				.setCustomId(id2)
				.setLabel(options.buttons.rock)
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('✊');
			let paperbtn = new Discord.ButtonBuilder()
				.setCustomId(id3)
				.setLabel(options.buttons.paper)
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('✋');
			let row = new Discord.ActionRowBuilder()
				.addComponents(rockbtn)
				.addComponents(paperbtn)
				.addComponents(scissorsbtn);
			const emd = new genEmbed()
				
				.setDescription(options.embed.description)
				
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				
			}
			question.edit({
				embeds: [emd],
				components : [row],
			});
			let opponentChose;
			let opponentChoice;
			let challengerChose;
			let challengerChoice;
			const collector = question.createMessageComponentCollector({
				filter: (fn) => fn,
				time: options.time,
			});
			collector.on('collect', async (button) => {
				if (
					button.member.id !== options.opponent.id &&
					button.member.id !== options.message.author.id
				) {
					return button.reply({
						content: options.othersMessage.replace(
							'{{author}}',
							`<@${options.message.author.id}> & <@${options.opponent.id}>`,
						),
						ephemeral: true,
					});
				}
				if (button.member.id === options.message.author.id) {
					challengerChose = true;
					if (typeof challengerChoice !== 'undefined') {
						return button.reply({
							content: options.noChangeMessage,
							ephemeral: true,
						});
					}
					if (button.customId === id2) {
						challengerChoice = '✊';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✊'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)


							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					} else if (button.customId === id3) {
						challengerChoice = '✋';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✋'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
                            await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)
							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					} else if (button.customId === id1) {
						challengerChoice = '✌️';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✌️'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)

							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					}
				} else if (button.member.id === options.opponent.id) {
					opponentChose = true;
					if (typeof opponentChoice !== 'undefined') {
						return button.reply({
							content: options.noChangeMessage,
							ephemeral: true,
						});
					}
					if (button.customId === id2) {
						opponentChoice = '✊';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✊'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)

                                
							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					} else if (button.customId === id3) {
						opponentChoice = '✋';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✋'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)

							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					} else if (button.customId === id1) {
						opponentChoice = '✌️';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✌️'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
            await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
            await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
							)
await client.Economy.updateBalance(options.opponent.id, options.ödül, "add", 1)
							} else {
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
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
							)
await client.Economy.updateBalance(options.message.author.id, options.ödül, "add", 1)
;
							}
							scissorsbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id1)
								.setLabel(options.buttons.scissors)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✌️');
							rockbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id2)
								.setLabel(options.buttons.rock)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✊');
							paperbtn = new Discord.ButtonBuilder()
								.setDisabled()
								.setCustomId(id3)
								.setLabel(options.buttons.paper)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji('✋');
							row = new Discord.ActionRowBuilder()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new genEmbed()
								
								.setColor(options.embed.color)
								.setDescription(result)
.addFields(
									{
										name: "Karşılaşma Sonucu",
										value: `\` ❯ \` ${options.message.author}: ${challengerChoice}
\` ❯ \` ${options.opponent}: ${opponentChoice}`,
										inline: true,
									},
								)
								;
							if (options.embed.timestamp) {
								
							}
							collector.stop();
							data.delete(options.opponent.id);
							data.delete(options.message.author.id);
							return question.edit({
								embeds: [_embed],
								components : [],
							});
						}
					}
				}
			});
			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					scissorsbtn = new Discord.ButtonBuilder()
						.setDisabled()
						.setCustomId(id1)
						.setLabel(options.buttons.scissors)
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('✌️');
					rockbtn = new Discord.ButtonBuilder()
						.setDisabled()
						.setCustomId(id2)
						.setLabel(options.buttons.rock)
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('✊');
					paperbtn = new Discord.ButtonBuilder()
						.setDisabled()
						.setCustomId(id3)
						.setLabel(options.buttons.paper)
						.setStyle(ButtonStyle.Secondary)
						.setEmoji('✋');
					row = new Discord.ActionRowBuilder()
						.addComponents(rockbtn)
						.addComponents(paperbtn)
						.addComponents(scissorsbtn);
					const _embed = new genEmbed()
						
						.setDescription(options.timeEndMessage)
						
						.setColor(options.embed.color);
                        await client.Economy.updateBalance(options.opponent.id, options.bahis, "add", 1)
                        await client.Economy.updateBalance(options.message.author.id, options.bahis, "add", 1)
					data.delete(options.opponent.id);
					data.delete(options.message.author.id);
					return question.edit({
						embeds: [_embed],
						components : [],
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
.setEmoji(options.message.guild.emojiGöster(emojiler.Onay).id);
			denybutton = new Discord.ButtonBuilder()
				.setDisabled()
				.setStyle(ButtonStyle.Danger)
				.setLabel(options.buttons.deny)
				.setCustomId("deny")
.setEmoji(options.message.guild.emojiGöster(emojiler.Iptal).id);
			component = new Discord.ActionRowBuilder().addComponents([
				acceptbutton,
				denybutton,
			]);
			const _embed = new genEmbed()
				
				.setDescription(
					options.endMessage.replace('{{opponent}}', options.opponent.id),
				)
				
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				
			}
			data.delete(options.opponent.id);
			data.delete(options.message.author.id);
			return question.edit({
				embeds: [_embed],
				components : [],
			});
		}
	});
};