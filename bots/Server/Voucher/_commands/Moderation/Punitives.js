const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const table = require('table');
const {genEmbed} = require('../../../../Global/Init/Embed');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder } = require("discord.js");


const Discord = require("discord.js")
module.exports = {
    Isim: "cezalar",
    Komut: ["sicil","sicili","sicilim","mute-ceza","ban-ceza","jail-ceza","uyarı-ceza"],
    Kullanim: "sicil <@cartel/ID>",
    Aciklama: "Belirlenen üyenin bütün ceza verisini gösterir.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0]) || message.member;
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await Punitives.find({Member: uye.id}).exec(async (err, res) => {
        if(err) return message.reply('Hata: `Bazı hatalar oluştu :(`').then(x => x.delete({timeout: 5000}));
        if(!await Punitives.findOne({Member: uye.id})) return message.reply(`${uye} üyesinin ceza-i bilgilerine ulaşılamadı.`).then(x => setTimeout(() => {x.delete()}, 7500));;
        let msg = await message.reply({content: `Veriler yükleniyor...`});
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
        let datachat = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
        datachat = datachat.concat(res.filter(value => value.Type === "Metin Susturulma").map(value => {
          return [
                `\`#${value.No}\``,
                `**[${value.Type}]**`,
                //`${value.Active == true ? "✅" : "❌"}`,
                `${tarihsel(value.Date)} Tarihinde`,
                `**${value.Reason}** Sebebiyle`,
                `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
            ]
        }));
      let verilerchat = table.table(datachat, {
          columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
          border: table.getBorderCharacters(`void`),
          drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
          }
      });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let datases = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
        datases = datases.concat(res.filter(value => value.Type === "Ses Susturulma").map(value => {
          return [
                `\`#${value.No}\``,
                `**[${value.Type}]**`,
                //`${value.Active == true ? "✅" : "❌"}`,
                `${tarihsel(value.Date)} Tarihinde`,
                `**${value.Reason}** Sebebiyle`,
                `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
            ]
        }));
      let verilerses = table.table(datases, {
          columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
          border: table.getBorderCharacters(`void`),
          drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
          }
      });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let datauyari = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
datauyari = datauyari.concat(res.filter(value => value.Type === "Uyarılma").map(value => {
  return [
                `\`#${value.No}\``,
                `**[${value.Type}]**`,
                //`${value.Active == true ? "✅" : "❌"}`,
                `${tarihsel(value.Date)} Tarihinde`,
                `**${value.Reason}** Sebebiyle`,
                `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
            ]
        }));
      let verileruyari = table.table(datauyari, {
          columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
          border: table.getBorderCharacters(`void`),
          drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
          }
      });
///////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let datajail = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
        datajail = datajail.concat(res.filter(value => value.Type === "Karantina").map(value => {
          return [
                `\`#${value.No}\``,
                `**[${value.Type}]**`,
                //`${value.Active == true ? "✅" : "❌"}`,
                `${tarihsel(value.Date)} Tarihinde`,
                `**${value.Reason}** Sebebiyle`,
                `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
            ]
        }));
      let verilerjail = table.table(datajail, {
          columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
          border: table.getBorderCharacters(`void`),
          drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
          }
      });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      let databan = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
      databan = databan.concat(res.filter(value => value.Type === "Yasaklama").map(value => {
        return [
              `\`#${value.No}\``,
              `**[${value.Type}]**`,
              //`${value.Active == true ? "✅" : "❌"}`,
              `${tarihsel(value.Date)} Tarihinde`,
              `**${value.Reason}** Sebebiyle`,
              `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
          ]
      }));
    let verilerban = table.table(databan, {
        columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
        border: table.getBorderCharacters(`void`),
        drawHorizontalLine: function (index, size) {
            return index === 0 || index === 1 || index === size;
        }
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let datatop = [["ID", "Ceza Türü", "Ceza Tarihi", "Ceza Sebebi", "Cezalandıran Yetkili"]];
datatop = datatop.concat(res.map(value => {    
    return [
        `\`#${value.No}\``,
        `**[${value.Type}]**`,
        //`${value.Active == true ? "✅" : "❌"}`,
        `${tarihsel(value.Date)} Tarihinde`,
        `**${value.Reason}** Sebebiyle`,
        `<@${value.Staff}> Tarafından Ceza-i İşlem Uygulandı \n`
    ]
}));
let verilertop = table.table(datatop, {
  columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
  border: table.getBorderCharacters(`void`),
  drawHorizontalLine: function (index, size) {
      return index === 0 || index === 1 || index === size;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let buttonGroup = [{label: "Chat Susturulmaları", description: `Kullanıcının aldığı Chat Susturma Cezaları listelenmektedir.`, emoji: {id: "1230914512186773575"}, value: "chatmute"},
        {label: "Ses Susturulmaları", description: "Kullanıcının aldığı Ses Susturma Cezaları listelenmektedir.", emoji: {id: "1230914644252561530"}, value: "sesmute"}, 
        {label: "Uyarı Cezaları", description: `Kullanıcının aldığı Uyarı Cezaları listelenmektedir.`, emoji: {id: "1232038364052455435"}, value: "uyariceza"},
        {label: "Karantina Cezaları", description: "Kullanıcının aldığı Karantina Cezaları listelenmektedir.", emoji: {id: "1232275857985503263"}, value: "jailceza"}, 
        {label: "Yasaklama Cezaları", description: "Kullanıcının aldığı Yasaklama Cezaları listelenmektedir.", emoji: {id: "1232275804965044255"}, value: "banceza"}, 
        {label: "Ceza Geçmişi", description: "Kullanıcının aldığı Yasaklama Cezaları listelenmektedir.", emoji: {id: "1230564319079694376"}, value: "topceza"}, 
      ]
       
        let Rowcuk = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("listStats")
            .setPlaceholder(`${uye.user.username}'n detaylarını görüntüle`)
            .setOptions([
              buttonGroup
            ])
        )
        let Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("mesaj")
            .setEmoji("1000142003729874975")
            .setLabel("Aldığı Cezalar")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false)
        )
        let barSystem = [
            {id: "sari", baslamaBar: "saribas", doluBar: "sariorta", doluBitisBar: "sarison"},
          ]
          function progressBar(value, maxValue, size, veri, renk = barSystem.shuffle()[0]) {
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri == 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlamaBar)}`
            const progressText = `${message.guild.emojiGöster(emojiler.Terfi.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojiGöster(emojiler.Terfi.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojiGöster(emojiler.Terfi.doluBitişBar)}` : `${message.guild.emojiGöster(emojiler.Terfi.boşBitişBar)}`}`;
            return bar;
          };
              let cezaPuanı = await uye.cezaPuan()
              let cezapuanmax = "150";

              async function checkTrustLevel(uye) {
                let cezaPuanı2 = await uye.cezaPuan();
                if (cezaPuanı2 >= 0 && cezaPuanı2 <= 25) {
                  return "Güvenilir";
                } else if (cezaPuanı2 >= 26 && cezaPuanı2 <= 50) {
                  return "Şüpheli";
                } else if (cezaPuanı2 >= 51 && cezaPuanı2 <= 99) {
                  return "Dikkat Edilmeli";
                } else if (cezaPuanı2 >= 100) {
                  return "İşlem Yapılamaz";
                }
              }
              

              let trustLevel = await checkTrustLevel(uye);


              let ses = new genEmbed()
    .setDescription(`${message.guild.emojiGöster("information")} Kullanıcının öğrenmek istediğiniz sicilin kategorisini aşağıda bulunan menüden seçiniz.
    
    ${message.guild.emojiGöster("soru")} \` Ceza Puanı Durumu  :\` ${progressBar(cezaPuanı ? cezaPuanı.toFixed(1) : 0, cezapuanmax, 5, cezapuanmax)} (${cezaPuanı})

    ${message.guild.emojiGöster("information")} Ceza Puanı Bilgisi: **${trustLevel}**
    `).setColor("#ffffff").setThumbnail(message.guild.iconURL({extension: 'png'}))


  
       /*  message.channel.send(`:no_entry_sign: <@${uye.id}> üyesinin ceza bilgileri aşağıda belirtilmiştir. Tekli bir cezaya bakmak için \`.ceza ID\` komutunu uygulayınız.\n\`\`\`${veriler}\`\`\``)
            .catch(kedy => {
            message.channel.send({content: `:no_entry_sign: <@${uye.id}> üyesinin cezaları **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim, oradan cezaları kontrol edebilirsin.\nTekli bir cezaya bakmak için \`.ceza bilgi ID\` komutunu uygulayınız.`,     files: [{
                attachment: Buffer.from(veriler),
                name: `${uye.id}-cezalar.txt`
            }]}); 
        });*/
   

    await msg.edit({
        content: null,
        components: [Rowcuk],
        embeds: [ses],
     })

    let filter = message.author
    let collector = await msg.createMessageComponentCollector({time: 60000});
    

    collector.on('collect', async (i) => {
      if(i.values[0] == "chatmute") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verilerchat}`)
          ]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
      if(i.values[0] == "sesmute") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verilerses}`)
          ]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
      if(i.values[0] == "uyariceza") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verileruyari}`)
    ]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
      if(i.values[0] == "jailceza") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verilerjail}`)
          ]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
      if(i.values[0] == "banceza") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verilerban}`)
]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
      if(i.values[0] == "topceza") {
        msg.edit({components: [Rowcuk],embeds: [new genEmbed().setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: 'png', size: 2048})})
          .setDescription(`${verilertop}`)
         ]}).catch(err => {})
        i.deferUpdate().catch(err => {})
      }
       if(i.customId == "mesaj") {
           msg.delete().catch(err => {})
           let com = client.commands.find(x => x.Isim == "cezalar")
           if(com) com.onRequest(client, message, args)
           await i.deferUpdate().catch(err => {})
       }
    })
    })
}
}