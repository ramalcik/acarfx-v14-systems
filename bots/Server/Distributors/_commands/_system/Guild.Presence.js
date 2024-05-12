const { Client, Message, Util, ActionRowBuilder, ButtonBuilder, ButtonStyle,  StringSelectMenuBuilder} = require("discord.js");
const StatsSchema = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats');
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
const Discord = require("discord.js")
module.exports = {
    Isim: "yapılandırma",
    Komut: ["yapilandir","yapılandır","yapilandirma"],
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
    

      let msg = await message.reply({content: `Yapılandırma hizmeti yükleniyor... Lütfen bekleyin!`});

      let Row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId("isimyapilandirma")
          .setLabel("Toplu İsim Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("tagyapilandirma")
          .setLabel("Toplu Tag Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("sunucuyapılandırma")
          .setLabel("Sunucu Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
          new ButtonBuilder()
          .setCustomId("kanalrolyapilandirma")
          .setLabel("Toplu Kanal/Rol Yapılandırması")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("998210562586583060"),
      )

      await msg.edit({content: null,components: [Row], embeds: [
        
        new genEmbed().setThumbnail(message.guild.iconURL({extension: 'png'}))
        .setDescription(`Aşağıda bulunan düğmeler ile \`${message.guild.name}\` sunucusunun bot ve sunucu yapılandırma işlemlerini yapabilirsiniz. Yapılandırma işlemi yapıldığında, botunuzun çalışmasını kolaylaştıracaktır. Sunucu yapısı değiştiğinde, sunucu ismi veya tagı değiştiğinde tüm yapılandırmaları bu panelden yapabilirsiniz. Artık tek tek uğraşmaya son.`)
        .setColor("Random")

      ]})

      var filter = (i) => i.user.id == message.author.id;
      let collector = msg.createMessageComponentCollector({filter: filter, time: 60000})

      collector.on("collect", async (i) => {
          if(i.customId == "isimyapilandirma") {
              message.guild.members.cache.filter(x => !x.user.bot)
              .forEach(async (uye) => {
                let data = await Users.findOne({_id: uye.id})
                if(data && data.Name && data.Gender == "Kayıtsız") {
                  if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${data.Name}`).catch(err => {})
                  if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                } else {
                  if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`).catch(err => {})
                  if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`).catch(err => {})
                }

      
              })
              i.reply({content: `**Başarıyla!** ${message.guild.name} sunucusunun isimleri yapılandırıldı! ${message.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true})
          }
         
      })

      collector.on("end", async (i, reason) => {
        if(reason == "time"){
          await msg.delete().catch(err => {})
        }
      })

    }
};