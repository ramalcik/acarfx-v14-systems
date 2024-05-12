const { Client, Message, EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");

const Users = require('../../../../Global/Databases/Schemas/Users.Components');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "checklog",
    Komut: ["tıklamalog","tıklamalog","tiklamalog","ilgilenme","ilgilenmeler"],
    Kullanim: "ilgilenme @cartel/ID",
    Aciklama: "Bir üyenin rol geçmişini görüntüler.",
    Kategori: "yönetim",
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
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    if(!uye) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    uye = message.guild.members.cache.get(uye.id)
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
    Users.findOne({_id: uye.id }, async (err, res) => {
      if (!res) return message.reply({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res.Checks) return message.reply({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let pages = res.Checks.sort((a, b) => b.date - a.date).chunk(15);
      var currentPage = 1
      let geçerliolanlar = res.Checks.filter(x => {
        let uye = message.guild.members.cache.get(x.target)
        return uye && (uye.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => uye.roles.cache.has(x)))
}).length
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.reply({embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setDescription(`${uye} isimli üyenin ilgilenme bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new genEmbed().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png'})}).setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, iconURL: message.guild.iconURL({extension: 'png'})})
      const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.reply({
        embeds: [embed.setDescription(`${uye}, üyesinin ilgilenme bilgisi yükleniyor... Lütfen bekleyin...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`Geçerli olan ilgilenmeler "${message.guild.emojiGöster(emojiler.Onay)}" olarak görülür, geçersiz olanlar ise "${message.guild.emojiGöster(emojiler.Iptal)}" olarak görültülenir.
    
Geçerli olan: ${geçerliolanlar}
Geçersiz olan: ${res.Checks.length - geçerliolanlar}

${pages[currentPage - 1].map((x, index) => {
        let okey = false
        let uye = message.guild.members.cache.get(x.target)
        if(uye && (uye.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => uye.roles.cache.has(x)))) okey = true
        return `\` ${index+1} \` <@!${uye ? uye.id : x.target}> <t:${String(x.date).slice(0, 10)}:R> [**${x.type}** | ${okey ? message.guild.emojiGöster(emojiler.Onay) : message.guild.emojiGöster(emojiler.Iptal)}] `
      }).join("\n")}`)]}).catch(err => {})

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
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`Geçerli olan ilgilenmeler ${message.guild.emojiGöster(emojiler.Onay)} olarak görülür, geçersiz olanlar ise ${message.guild.emojiGöster(emojiler.Iptal)} olarak görültülenir.
    
Geçerli olan: ${geçerliolanlar}
Geçersiz olan: ${res.Checks.length - geçerliolanlar}
          
    ${pages[currentPage - 1].map((x, index) => {
            let okey = false
            let uye = message.guild.members.cache.get(x.target)
            if(uye && (uye.user.username.includes(ayarlar.tag) || roller.Yetkiler.some(x => uye.roles.cache.has(x)))) okey = true
            return `\` ${index+1} \` <@!${uye ? uye.id : x.target}> <t:${String(x.date).slice(0, 10)}:R> [**${x.type}** | ${okey ? message.guild.emojiGöster(emojiler.Onay) : message.guild.emojiGöster(emojiler.Iptal)}] `
          }).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter({ text: `${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, iconURL: message.guild.iconURL({extension: 'png'})}).setDescription(`${uye} isimli üyesinin toplamda \`${res.Checks.length || 0}\` adet tıklama bilgisi mevcut.`)],
          components: [],
        }).catch(err => {});
      })
    })
 }
};