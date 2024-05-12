const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");

const Discord = require("discord.js")
module.exports = {
    Isim: "rol",
    Komut: ["rol"], 
    Kullanim: "rol <@cartel/ID>",
    Aciklama: "",
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
    if(!ayarlar.staff.includes(message.member.id) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!roller.rolPanelRolleri) return message.reply(cevaplar.notSetup).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(uye.id == message.author.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let rolList = [];
    let oyunRolleri = message.guild.roles.cache.sort((a, b) => b.position - a.position).filter(rol => roller.rolPanelRolleri.some(x => rol.id == x) && message.member.roles.highest.comparePositionTo(message.guild.roles.cache.get(rol.id)) > 1).forEach(x => {
      rolList.push([
        { label: x.name, description: "ID: "+ x.id, value: x.id}        
      ])
    })
   let rolcükler = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId(`rolveral`)
      .setPlaceholder('Rol vermek/almak için rol seçiniz!')
      .addOptions([
          rolList.slice(0, 25)
      ]),
    )
    let Info = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("rollog")
        .setLabel("Rol Geçmişi Görüntüle")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("YetkiVer")
        .setLabel("Yetki Güncelleme")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator) || roller.yükselticiRoller.some(x => message.member.roles.cache.has(x)) || roller.limitliYükselticiRolleri.some(x => message.member.roles.cache.has(x)) ? false : true)
    )
    let msg = await message.reply({embeds: [new genEmbed().setColor("Random").setDescription(`${uye} isimli üyeye verilmesini istediğiniz rolü aşağıda ki menüden seçiniz!`)], components: [rolcükler,Info]})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })
 
    collector.on('collect', async i => { 
      if(i.customId == "rollog") {
        let kom = client.commands.find(x => x.Isim == "rollog")
        kom.onRequest(client, message, args)
        msg.delete().catch(err => {})
        return i.reply({content: `Başarıyla "Rol Geçmişi" komutu işlendi. ${message.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true })
      }
      if(i.customId == "YetkiVer") {
        let kom = client.commands.find(x => x.Isim == "yetki")
        kom.onRequest(client, message, args)
        msg.delete().catch(err => {})
        return i.reply({content: `Başarıyla "Yetki Güncelleme" komutu işlendi. ${message.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true })
      }
      if(i.customId == "rolveral") {
        let role = [i.values[0]]
          if(role.some(x => message.member.roles.highest.comparePositionTo(message.guild.roles.cache.get(x)) < 1)) {
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            msg.delete().catch(err => {})
            return i.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rol(ler) yetkinin üstünde olduğu için işlem yapılamadı.`, ephemeral: true })
          }
            if(uye.roles.cache.has(i.values[0])) {
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: i.values[0], mod: message.author.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true })
              message.guild.kanalBul("rol-al-log").send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeden <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından ${role.map(x => message.guild.roles.cache.get(x)).join(",")} adlı ${role.length > 1 ? 'rolleri' : "rol"} geri alındı.`)]})
              await uye.roles.remove(i.values[0])
              i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} ${uye}, isimli üyenin ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rolleri üzerinden kaldırıldı!`, ephemeral: true })
            
            } else {
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: i.values[0], mod: message.author.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true })
              message.guild.kanalBul("rol-ver-log").send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından ${role.map(x => message.guild.roles.cache.get(x)).join(",")} adlı ${role.length > 1 ? 'rolleri' : "rol"} verildi.`)]})  
              await uye.roles.add(i.values[0])
              i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} ${uye}, isimli üyenin ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rolleri üzerine verildi!`, ephemeral: true })
            }
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
          msg.delete().catch(err => {})
        }
      

    })

    collector.on("end", () => {
      msg.delete().catch(err => {})
    })

    }
};
