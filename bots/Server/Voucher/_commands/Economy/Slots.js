const { Client, Message, EmbedBuilder} = require("discord.js");
const moment = require("moment");
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
require("moment-timezone");
const Beklet = new Set();

const Discord = require("discord.js")
module.exports = {
    Isim: "slots",
    Komut: ["slot", "s"],
    Kullanim: "slots <100-250000-all>",
    Aciklama: "",
    Kategori: "eco",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  onRequest: async function (client, message, args) {

    }
};

