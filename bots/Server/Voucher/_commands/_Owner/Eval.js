const { Client, Message } = require("discord.js");
module.exports = {
    Isim: "eval",
    Komut: ["ev"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let ids = ["719117042904727635"];
if (!ids.includes(message.member.user.id)) return;

function clean(text) {
  if (typeof text === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

const cartel = message.content.split(' ');
if (!cartel[1]) return message.react(message.guild.emojis.cache.find(emoji => emoji.name === "Iptal") ? message.guild.emojis.cache.find(emoji => emoji.name === "Iptal").id : undefined).catch(err => message.reply('Kod belirtmedin.'));
if (cartel[1] === "client") return message.react(message.guild.emojis.cache.find(emoji => emoji.name === "Iptal") ? message.guild.emojis.cache.find(emoji => emoji.name === "Iptal").id : undefined).catch(err => message.reply('Kod belirtmedin.'));

try {
  const code = cartel.slice(1).join(' ');
  let evaled = clean(await eval(code));

  if (typeof evaled !== "string") evaled = require("util").inspect(evaled).replace(client.token, "Yasaklı komut");

  const arr = splitMessages(evaled, { maxLength: 1950, char: "\n" });
  arr.forEach(element => {
    message.channel.send({ content: `\`\`\`js\n${element}\n\`\`\`` });
  });
} catch (err) {
  message.channel.send(`\`EX-ERR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}

function splitMessages(text, options = {}) {
    const maxLength = options.maxLength || 2000;
    const char = options.char || "\n";
    const messages = [];
    
    const lines = text.split(char);
    let currentMessage = "";
    let currentLength = 0;
    
    for (const line of lines) {
      if (currentLength + line.length + char.length <= maxLength) {
        currentMessage += line + char;
        currentLength += line.length + char.length;
      } else {
        messages.push(currentMessage);
        currentMessage = line + char;
        currentLength = line.length + char.length;
      }
    }
    
    if (currentMessage.length > 0) {
      messages.push(currentMessage);
    }
    
    return messages;
  }
}
};