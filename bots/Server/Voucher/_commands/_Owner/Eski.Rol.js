const leftRoles = require('../../../../Global/Databases/Schemas/Users.Left.Roles');
const { EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const Discord = require("discord.js")
module.exports = {
    Isim: "eskirol",
    Komut: ["leftrole"],
    Kullanim: "eskirol <@cartel/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
  
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).then(x => setTimeout(() => {
        message.delete().catch(err => {})
    }, 7500));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000))
    let data = await leftRoles.findOne({_id: uye.id})
    if(!data) return message.reply(cevaplar.data).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let load = await message.reply({content: `${uye.user.username} üyesinin çıkmadan önceki yetki rolleri listeleniyor. Lütfen bekleyin...`})
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("tanımla")
            .setLabel("Üstüne Tanımla!")
            .setStyle(ButtonStyle.Secondary)
    )
    load.edit({content: null, components: [Row], embeds: [new genEmbed().setDescription(`Aşağı da ${uye} isimli üyenin sunucudan atılmadan/çıkmadan önceki rol veya rolleri listelenmektedir. 

**Rol(ler) şunlardır**:
${data._roles.filter(x => message.guild.roles.cache.get(x)).map(x => message.guild.roles.cache.get(x)).join("\n")}`)]})

        let filter  = (i) => i.user.id == message.author.id
        let collector = load.createMessageComponentCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (i) => {
            if(i.customId == "tanımla") {
                i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üyenin rollerine eski rolleri tanımlandı ve verisi temizlendi.`, ephemeral: true})
                let rol = []
                data._roles.filter(x => message.guild.roles.cache.get(x)).map(x => rol.push(x))
                uye.setRoles(rol)
                await leftRoles.deleteOne({_id: uye.id})
                
            }
        })
        collector.on('end', async (i) => {
            load.delete().catch(err => {})
        })
    }
};



