const { Client, Message } = require("discord.js");
const util = require("util")
const Game = require('../../../../Global/Plugins/Economy/_games/Blackjack/index')
const Discord = require("discord.js")
module.exports = {
    Isim: "bj",
    Komut: ["blackjack","bj21"],
    Kullanim: "blackjack <100-500000-all>",
    Aciklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
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
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
  

  }
};