const data = new Set();
const Discord = require('discord.js');
const {genEmbed} = require('../../../Init/Embed');
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

	if (!options.emojis) options.emojis = {};
	if (typeof options.emojis !== 'object') {
		throw new TypeError('Weky Error: emojis must be an object.');
	}

	if (!options.emojis.empty) options.emojis.empty = '⬛';
	if (typeof options.emojis.empty !== 'string') {
		throw new TypeError('Weky Error: empty emoji must be an emoji.');
	}

	if (!options.emojis.snakeBody) options.emojis.snakeBody = '🟩';
	if (typeof options.emojis.snakeBody !== 'string') {
		throw new TypeError('Weky Error: snakeBody emoji must be an emoji.');
	}

	if (!options.emojis.food) options.emojis.food = '🍎';
	if (typeof options.emojis.food !== 'string') {
		throw new TypeError('Weky Error: food emoji must be an emoji.');
	}

	if (!options.emojis.up) options.emojis.up = '⬆️';
	if (typeof options.emojis.up !== 'string') {
		throw new TypeError('Weky Error: up emoji must be an emoji.');
	}

	if (!options.emojis.right) options.emojis.right = '⬅️';
	if (typeof options.emojis.right !== 'string') {
		throw new TypeError('Weky Error: right emoji must be an emoji.');
	}

	if (!options.emojis.down) options.emojis.down = '⬇️';
	if (typeof options.emojis.down !== 'string') {
		throw new TypeError('Weky Error: down emoji must be an emoji.');
	}

	if (!options.emojis.left) options.emojis.left = '➡️';
	if (typeof options.emojis.left !== 'string') {
		throw new TypeError('Weky Error: left emoji must be an emoji.');
	}

	if (!options.othersMessage) {
		options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	}
	if (typeof options.othersMessage !== 'string') {
		throw new TypeError('Weky Error: othersMessage must be a string.');
	}

	if (!options.buttonText) options.buttonText = 'Cancel';
	if (typeof options.buttonText !== 'string') {
		throw new TypeError('Weky Error: buttonText must be a string.');
	}

	if (data.has(options.message.author.id)) return;
	data.add(options.message.author.id);

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

	const id4 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const id5 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const id6 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	const id7 =
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20) +
		'-' +
		functions.getRandomString(20);

	let score = 0;
	const width = 15;
	const height = 10;
	const gameBoard = [];
	let inGame = false;
	let snakeLength = 1;
	const apple = { x: 0, y: 0 };
	let snake = [{ x: 0, y: 0 }];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			gameBoard[y * width + x] = options.emojis.empty;
		}
	}

	function gameBoardToString() {
		let str = '';
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (x == apple.x && y == apple.y) {
					str += options.emojis.food;
					continue;
				}
				let flag = true;
				for (let s = 0; s < snake.length; s++) {
					if (x == snake[s].x && y == snake[s].y) {
						str += options.emojis.snakeBody;
						flag = false;
					}
				}
				if (flag) {
					str += gameBoard[y * width + x];
				}
			}
			str += '\n';
		}
		return str;
	}

	function isLocInSnake(pos) {
		return snake.find((sPos) => sPos.x == pos.x && sPos.y == pos.y);
	}

	function newappleLoc() {
		let newapplePos = {
			x: 0,
			y: 0,
		};
		do {
			newapplePos = {
				x: parseInt(Math.random() * width),
				y: parseInt(Math.random() * height),
			};
		} while (isLocInSnake(newapplePos));
		apple.x = newapplePos.x;
		apple.y = newapplePos.y;
	}

	function step(msg) {
		if (apple.x == snake[0].x && apple.y == snake[0].y) {
			score += 1;
			snakeLength++;
			newappleLoc();
		}

		const editEmbed = new genEmbed()
		.setColor("Yellow")
		.setAuthor(null)
			.setDescription(gameBoardToString());
		lock1 = new Discord.ButtonBuilder()
			.setLabel('\u200b')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId(id1)
			.setDisabled();
		w = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.up)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id2);
		lock2 = new Discord.ButtonBuilder()
			.setLabel('\u200b')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId(id7)
			.setDisabled();
		a = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.right)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id3);
		s = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.down)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id4);
		d = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.left)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id5);
		stopy = new Discord.ButtonBuilder()
			.setLabel(options.buttonText)
			.setEmoji(options.st)
			.setStyle(ButtonStyle.Danger)
			.setCustomId(id6);

		msg.edit({
			embeds: [editEmbed],
			components: [
				{
					type: 1,
					components: [lock1, w, lock2, stopy],
				},
				{
					type: 1,
					components: [a, s, d],
				},
			],
		});
	}

	async function gameOver(m) {
		lock1 = new Discord.ButtonBuilder()
			.setLabel('\u200b')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId(id1)
			.setDisabled();

		lock2 = new Discord.ButtonBuilder()
			.setLabel('\u200b')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId(id7)
			.setDisabled();
		w = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.up)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id2)
			.setDisabled();
		a = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.right)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id3)
			.setDisabled();
		s = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.down)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id4)
			.setDisabled();
		d = new Discord.ButtonBuilder()
			.setEmoji(options.emojis.left)
			.setStyle(ButtonStyle.Primary)
			.setCustomId(id5)
			.setDisabled();
		stopy = new Discord.ButtonBuilder()
			.setLabel(options.buttonText)
			.setStyle(ButtonStyle.Danger)
			.setCustomId(id6)
			.setDisabled();
		inGame = false;

		const editEmbed = new genEmbed().setColor("Green")
		let embedicerik = options.embed.description.replace('{{score}}', score).replace('{{kazanilan}}', Number(score * 10 * 5))
		if(score > 0) await client.Economy.updateBalance(options.message.member.id, Number(score * 10 * 5), "add", 1)
		editEmbed.setDescription(embedicerik);
		m.edit({
			embeds: [editEmbed],
			components: [
				
			],
		});
	}

	if (inGame) return;
	inGame = true;
	score = 0;
	snakeLength = 1;
	snake = [{ x: 5, y: 5 }];
	newappleLoc();
	const embed = new genEmbed()
	.setColor("Yellow")
	.setAuthor(null)
		.setDescription(gameBoardToString());

	let lock1 = new Discord.ButtonBuilder()
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(id1)
		.setDisabled();
	let w = new Discord.ButtonBuilder()
		.setEmoji(options.emojis.up)
		.setStyle(ButtonStyle.Primary)
		.setCustomId(id2);
	let lock2 = new Discord.ButtonBuilder()
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(id7)
		.setDisabled();
	let a = new Discord.ButtonBuilder()
		.setEmoji(options.emojis.right)
		.setStyle(ButtonStyle.Primary)
		.setCustomId(id3);
	let s = new Discord.ButtonBuilder()
		.setEmoji(options.emojis.down)
		.setStyle(ButtonStyle.Primary)
		.setCustomId(id4);
	let d = new Discord.ButtonBuilder()
		.setEmoji(options.emojis.left)
		.setStyle(ButtonStyle.Primary)
		.setCustomId(id5);
	let stopy = new Discord.ButtonBuilder()
		.setLabel(options.buttonText)
		.setStyle(ButtonStyle.Danger)
		.setCustomId(id6);

	const m = await options.message.reply({
		embeds: [embed],
		components: [
			{
				type: 1,
				components: [lock1, w, lock2, stopy],
			},
			{
				type: 1,
				components: [a, s, d],
			},
		],
	});

	const collector = m.createMessageComponentCollector({
		filter: (fn) => fn,
	});

	collector.on('collect', async (btn) => {
		if (btn.user.id !== options.message.author.id) {
			return btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					options.message.member.id,
				),
				ephemeral: true,
			});
		}
		await btn.deferUpdate();

		const snakeHead = snake[0];
		const nextPos = {
			x: snakeHead.x,
			y: snakeHead.y,
		};

		if (btn.customId === id3) {
			let nextX = snakeHead.x - 1;
			if (nextX < 0) {
				nextX = width - 1;
			}
			nextPos.x = nextX;
		} else if (btn.customId === id2) {
			let nextY = snakeHead.y - 1;
			if (nextY < 0) {
				nextY = height - 1;
			}
			nextPos.y = nextY;
		} else if (btn.customId === id4) {
			let nextY = snakeHead.y + 1;
			if (nextY >= height) {
				nextY = 0;
			}
			nextPos.y = nextY;
		} else if (btn.customId === id5) {
			let nextX = snakeHead.x + 1;
			if (nextX >= width) {
				nextX = 0;
			}
			nextPos.x = nextX;
		} else if (btn.customId === id6) {
			gameOver(m);
			collector.stop();
			data.delete(options.message.author.id);
		}

		if (isLocInSnake(nextPos)) {
			gameOver(m);
			collector.stop();
			data.delete(options.message.author.id);
		} else {
			snake.unshift(nextPos);
			if (snake.length > snakeLength) {
				snake.pop();
			}
			step(m);
		}
	});
};