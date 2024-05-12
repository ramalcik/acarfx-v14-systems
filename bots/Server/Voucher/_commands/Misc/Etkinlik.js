const { Client, Message, EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);

const Discord = require("discord.js")
module.exports = {
    Isim: "aktivite",
    Komut: ["aktivite", "together" ],
    Kullanim: "aktivite",
    Aciklama: "Belirtilen üyenin arka plan resmini büyültür.",
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
    if(!message.member.voice.channel) return message.reply(`Herhangi bir ses kanalı bağlı değilsin, Üzgünüm!`).then(x => {
      message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
      setTimeout(() => {
        x.delete()
      }, 7500);
    });
    let Activitys = [
      {label: "Youtube Together", description:"Arkadaşlarınla video seyretmek ister misin?", value: "youtube", emoji: {id: "947548339149365299"}},
      {label: "Poker Night", description:"Arkadaşlarınla Poker Night oynamak ister misin?", value: "poker", emoji: {id: "839989105785307167"}},
      {label: "Chess", description:"Arkadaşlarınla Satranç oynamak ister misin?", value: "chess", emoji: {id: "870434394932903956"}},
      {label: "Checkers", description:"Arkadaşlarınla Checkers oynamak ister misin?", value: "checkers", emoji: {id: "917487361028419646"}},
      {label: "Betrayal.io", description:"Arkadaşlarınla Betrayal oynamak ister misin?", value: "betrayal", emoji: {id: "917488565410213908"}},
      {label: "Fishington.io", description:"Arkadaşlarınla Fishington oynamak ister misin?", value: "fishing", emoji: {id: "917488701116919828"}},
      {label: "Lettertile", description:"Arkadaşlarınla Lettertile oynamak ister misin?", value: "lettertile", emoji: {id: "917487551646941264"}},
      {label: "Wordsnack", description:"Arkadaşlarınla Wordsnack oynamak ister misin?", value: "wordsnack", emoji: {id: "893608400359919717"}},
      {label: "Spellcast", description:"Arkadaşlarınla Spellcast oynamak ister misin?", value: "spellcast", emoji: {id: "917487698946711562"}},
      {label: "Doodlecrew", description:"Arkadaşlarınla Doodlecrew oynamak ister misin?", value: "doodlecrew", emoji: {id: "841744764273819658"}},
      {label: "Awkword", description:"Arkadaşlarınla Awkword oynamak ister misin?", value: "awkword", emoji: {id: "841744764273819658"}},
      {label: "Puttparty", description:"Arkadaşlarınla Puttparty oynamak ister misin?", value: "puttparty", emoji: {id: "841744764273819658"}}
    ]
    let Rows = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("wentyninbabannesi")
      .setPlaceholder(`Aktivitenizi belirleyin!`)
      .addOptions([
          Activitys
      ]),
    )
    let embed = new genEmbed()
    embed.setDescription("Aşağıda ki sıralanan aktivitelerden oynamak veya aktivite yapmak için seçiniz!")
    embed.setFooter({ text: "işlem yapılmaz ise otomatik olarak 30 saniye içerisinde silinecek."})
    message.channel.send({embeds: [embed], components: [Rows]}).then(msg => {
      let yarrakkkk = i => i.user.id == message.member.id
      let collector = message.channel.createMessageComponentCollector({filter: yarrakkkk, time: 30000, errors: ["time"]})

      collector.on('collect', async (i) => {
        if(i.customId == "wentyninbabannesi") {
        	let etkinlik = i.values


          if(etkinlik == "youtube") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
              embed.setDescription(`${message.member} tarafından Youtube Together seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `İzlemek için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };

          if(etkinlik == "poker") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
              embed.setDescription(`${message.member} tarafından Poker Night seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `İzlemek için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };

          if(etkinlik == "chess") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Satranç seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "checkers") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'checkers').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Checkers seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "betrayal") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'betrayal').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Betrayal seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "fishing") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'fishing').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Fishing seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "lettertile") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'lettertile').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Lettertile seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "wordsnack") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'wordsnack').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Wordsnack seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "doodlecrew") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'doodlecrew').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Doodlecrew seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "spellcast") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'spellcast').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Spellcast seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "awkword") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'awkword').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Awkword seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };
        
          if(etkinlik == "puttparty") {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'puttparty').then(async invite => {
              embed.setDescription(`${message.member}, tarafından Puttparty seçildi!`).setFooter({ text: "bu davet 10 saniye içerisinde silinecektir."})
              msg.edit({embeds: [embed], components: []})
              setTimeout(() => {
                msg.delete().catch(err => {})
              }, 10000);
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                await i.reply({content: `Oynamak için arkadaşlarınla bu davet kodunu kullanabilirsin.\n${invite.code}`, ephemeral: true})
            });
          };

        }
      })

      collector.on('end', c => {
        msg.delete().catch(err => {})
      } )



    });
    }
};