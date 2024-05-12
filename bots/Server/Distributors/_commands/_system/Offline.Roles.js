const Roles = require('../../../../Global/Databases/Schemas/Guards/GuildMember.Roles.Backup');
const { Client, Message, EmbedBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "offlineroles",
    Komut: ["of-roles","offline-roles","kapalılar","çıkmışyetkililer"],
    Kullanim: "offlineroles <@cartel/ID> <Miktar>",
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
    let embed = new genEmbed()
    let data = await Roles.find({})
    if(!data) message.reply({content: `Veritabanında çevrim-dışı olmuş ve yetkisi çekilmiş bir üye bulunamadı. ${message.guild.emojiGöster(emojiler.Onay)}`}).then(x => setTimeout(() => x.delete().catch(err => {}), 7500))
    let çevrimdışılar = data || []
    let rolBul = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(rolBul) çevrimdışılar = data.filter(x => x.Roles.includes(rolBul.id) && message.guild.members.cache.get(x._id)) || []
    let uyeBul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(uyeBul) çevrimdışılar = data.filter(x => x._id == uyeBul.id && message.guild.members.cache.get(x._id)) || []
    if(uyeBul && args[1] == "sil") {
        await Roles.deleteOne({_id: uyeBul.id})
        return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
    }
    if(args[0] == "auto") {
       let gg = data.filter(x => !message.guild.members.cache.get(x._id)) || []
       if(gg) gg.forEach(async (x) => {
            await Roles.deleteOne({_id: x._id})
       })
       return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
    }
    if(rolBul) {
        return message.reply({embeds: [embed.setDescription(`Aşağıda ${rolBul} rolünde çevrim-dışı alınca yetkisi çekilen üyeler aşağıda listelenmektedir.

**Üyeler (${rolBul})**:
${çevrimdışılar.filter(x => x.Roles.includes(rolBul.id)).map(x => `> ${message.guild.members.cache.get(x._id)} (${x.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")})`).join("\n")}
`)]})
    }
    if(uyeBul) {
        return message.reply({embeds: [embed.setDescription(`Aşağıda ${uyeBul} üyesinin çevrim-dışı veya tarayıcı girişinden çekilen yetkileri ${çevrimdışılar ? `listelenmektedir.
         
**Rol(ler) (${uyeBul})**:
${çevrimdışılar.map(x => `> ${x.Roles.map(c => message.guild.roles.cache.get(c))} (${x.Reason}) (<t:${String(Date.parse(x.Date)).slice(0, 10)}:R>)`)}` : `bulunamadı. ${cevaplar.prefix}`}
         `)]})
     }
    if(!rolBul || !uyeBul) {
        const arr1 = splitMessages(çevrimdışılar.filter(x => x.Reason == "Çevrimdışı" && message.guild.members.cache.get(x._id)).map(x => `> ${message.guild.members.cache.get(x._id)} (${x.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")})`).join("\n"), { maxLength: 3000, char: "\n" });
        arr1.forEach(element => {
          message.reply({ embeds: [embed.setDescription(`Aşağıda **${ayarlar.serverName}** sunucusunun çevrim-dışı alınca yetkisi çekilen üyeler aşağıda listelenmektedir.\n\n**Çevrim-Dışı Olanlar**:\n${element}`)] });
        });
        
        const arr2 = splitMessages(çevrimdışılar.filter(x => x.Reason == "Web tarayıcı girişi için kaldırıldı." && message.guild.members.cache.get(x._id)).map(x => `> ${message.guild.members.cache.get(x._id)} (${x.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")})`).join("\n"), { maxLength: 3000, char: "\n" });
        arr2.forEach(element => {
          message.reply({ embeds: [embed.setDescription(`Aşağıda **${ayarlar.serverName}** sunucusunun çevrim-dışı alınca yetkisi çekilen üyeler aşağıda listelenmektedir.\n\n**Tarayıcı Girişi Olanlar**:\n${element}`)] });
        });
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