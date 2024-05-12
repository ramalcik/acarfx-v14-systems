const { Client, Message} = require("discord.js");
const children = require("child_process");

const Discord = require("discord.js")
module.exports = {
    Isim: "pm2",
    Komut: ["pm2-controller"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    
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
    const ids = ['c', 'a', 'r', 't', 'e', 'l', 'f', 'x'];
if (!ids.includes(message.member.id)) return;

const ls = children.exec(`pm2 ${args.join(' ')}`);
ls.stdout.on('data', function (data) {
  const arr = splitMessages(data, { maxLength: 1950, char: "\n" });
  arr.forEach(element => {
    message.channel.send({ content: '```js\n' + element + '\n```' });
  });
});

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