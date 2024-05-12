const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yetki-geçmiş",
    Komut: ["yetkigeçmişi","yetkigecmis","yükseltimler","yukseltimler","yetki-gecmis","laststaff","yetkigecmisi","yetkiligeçmişi","yetkiligecmisi","yetkiligecmis","yetkiligeçmiş"],
    Kullanim: "yükseltimler <@cartel/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
    Kategori: "stat",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) && !roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) && !roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!kullanıcı) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.guild.members.cache.get(kullanıcı.id);
    if (!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));

                const button1 = new ButtonBuilder()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle(ButtonStyle.Primary);
          const buttonkapat = new ButtonBuilder()
                .setCustomId('kapat')
                .setLabel('❌')
                .setStyle(ButtonStyle.Secondary);
          const button2 = new ButtonBuilder()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle(ButtonStyle.Primary);
          Users.findOne({_id: uye.id }, async (err, res) => {
            let msg = await message.channel.send({embeds: [new genEmbed().setDescription(`Yetkili geçmişi taranıyor...`)]})
          if (!res) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500))
          if(!res.StaffLogs) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500))
          let pages = res.StaffLogs.sort((a, b) => b.Date - a.Date).chunk(10);
          var currentPage = 1
          if (!pages && !pages.length || !pages[currentPage - 1]) return msg.edit({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin yükseltim geçmiş bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete().catch(err => {})}, 7500))
          let embed = new genEmbed().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, iconURL: message.guild.iconURL({extension: 'png'})})
          const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
          if (message.deferred == false){
          await message.deferReply()
          };
          const curPage = await msg.edit({
          embeds: [embed.setDescription(`${uye} yetkilinin yükseltim geçmiş bilgisi yükleniyor. Lütfen bekleyin...`)],
          components: [row], fetchReply: true,
          }).catch(err => {});

          await curPage.edit({embeds: [embed.setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamadı"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>)`).join("\n")}`)]}).catch(err => {})

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
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamadı"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>) `).join("\n")}`)]
          }).catch(err => {});
          collector.resetTimer();
          });
          collector.on("end", () => {
          if(curPage) curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${uye} isimli yetkilinin toplamda \`${res.StaffLogs.length || 0}\` adet yükseltim geçmiş bilgisi mevcut.`)],
          components: [],
          }).catch(err => {});
          })
          })


    }
};

