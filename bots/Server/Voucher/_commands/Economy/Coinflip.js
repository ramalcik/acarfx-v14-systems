const { Client, Message, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
require("moment-timezone");
// ../../Assets/
const Discord = require("discord.js")
module.exports = {
    Isim: "coinflip",
    Komut: ["cf", "bahis"],
    Kullanim: "coinflip <100-500000-all>",
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

