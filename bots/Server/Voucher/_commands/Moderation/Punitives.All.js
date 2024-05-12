const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {genEmbed} = require('../../../../Global/Init/Embed')
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const ms = require('ms');

const Discord = require("discord.js")
module.exports = {
    Isim: "tümcezalar",
    Komut: ["tümcezalar","soncezalar","son-cezalar","tumcezalar"],
    Kullanim: "soncezalar",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "diğer",
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
    if(!roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const button1 = new ButtonBuilder()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle(ButtonStyle.Primary);
    const buttonkapat = new ButtonBuilder()
                .setCustomId('kapat')
 .setEmoji("929001437466357800")               
 .setStyle(ButtonStyle.Danger);
                
    const button2 = new ButtonBuilder()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle(ButtonStyle.Primary);
      let res = await Punitives.find()
      if (!res) return message.reply({embeds: [new genEmbed().setDescription(`${message.guild.name} sunucusunda ceza uygulanmadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res) return message.reply({embeds: [new genEmbed().setDescription(`${message.guild.name} sunucusunda ceza uygulanmadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let data = []
      res.map(x => data.push(x))
      res = [...data]
      let pages = res.sort((a, b) => b.Date - a.Date).chunk(10);
      console.log(data)
      var currentPage = 1
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.reply({embeds: [new genEmbed().setDescription(`${message.guild.name} sunucusunda ceza uygulanmadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new genEmbed().setColor("Random").setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, iconURL: message.guild.iconURL({extension: 'png'})})
      const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.reply({
        embeds: [embed.setDescription(`${message.guild.name} sunucusunun son atılan ceza listesi yükleniyor...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
      
      await curPage.edit({embeds: [embed.setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${x.No} \` <@${x.Member}> <t:${String(Date.parse(x.Date)).slice(0, 10)}:R> [**${x.Type}**] (<@${x.Staff}>)`).join("\n")}`)]}).catch(err => {})

      const filter = (i) => i.user.id == message.member.id

      const collector = await curPage.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "ileri":
            if (currentPage == pages.length) break;
            currentPage++;
            break;
          case "geri":
            if (currentPage == 1) break;
            currentPage--;
            break;
          default:
            break;
          case "kapat": 
            i.deferUpdate().catch(err => {});
            curPage.delete().catch(err => {})
            return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
        }
        await i.deferUpdate();
        await curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${x.No} \` <@${x.Member}> <t:${String(Date.parse(x.Date)).slice(0, 10)}:R> [**${x.Type}**] (<@${x.Staff}>)`).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${message.guild.name} sunucusunda toplamda \`${res.length || 0}\` adet ceza uygulandı.`)],
          components: [],
        }).catch(err => {});
      })
    }
};