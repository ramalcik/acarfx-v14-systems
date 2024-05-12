const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const TalentPerms = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const task = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const Discord = require("discord.js")
module.exports = {
    Isim: "tp",
    Komut: ["talentperm","talentperms","özelkomut","rolkomut"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on('interactionCreate', async (modal) => {
      let guild = client.guilds.cache.get(modal.guildId);

      if(!guild) {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel olarak bir hata oluştur` , ephemeral: true })
      }
      let uye = guild.members.cache.get(modal.user.id)
      if(!uye){
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      if(modal.customId == "tp-kaldır") {
        let cmdName = modal.fields.getTextInputValue('tp_isim');
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms.find(cartel => cartel.Commands == cmdName)
        if(!cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
        await TalentPerms.updateOne({guildID: guild.id}, { $pull: { "talentPerms": cmd } }, { upsert: true })
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla ${cmdName} komutu <t:${String(Date.now()).slice(0, 10)}:R> kaldırıldı. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })

      }
      if(modal.customId == "tp-detay") {
        let cmdName = modal.fields.getTextInputValue('tp_isim');
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms.find(cartel => cartel.Commands == cmdName)
        if(!cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
       
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({embeds: [new genEmbed().setThumbnail(guild.iconURL({extension: 'png'})).setDescription(`Aşağı da **${cmdName}** isimli rol (ver/al) veya alt komutun detaylı bilgileri belirtilmiştir.\n
Bu komut ${cmd.Author ? guild.members.cache.get(cmd.Author) ? guild.members.cache.get(cmd.Author) : `<@${cmd.Author}>` : uye} tarafından ${cmd.Date ? `<t:${String(cmd.Date).slice(0, 10)}:R>` : `<t:${String(Date.now()).slice(0, 10)}:R>`} oluşturdu.

**Verilen rol(ler)**:
${cmd.Roles ? cmd.Roles.map(x => guild.roles.cache.get(x)).join(", ") : "@rol bulunamadı"} rol veya rollerini veriyor.
**Kullanacak rol(ler)**:
${cmd.Permission ? cmd.Permission.map(x => guild.roles.cache.get(x)).join(", ") : "@rol bulanamadı"} rol veya rolleri kullanabilir.`)] , ephemeral: true })


      }
      if(modal.customId == "tp-ekle") {
        let cmdName = modal.fields.getTextInputValue('tp_isim');
        let cmdType = modal.fields.getTextInputValue("tp_kullancakroller") || [] 
        let cmdContent = modal.fields.getTextInputValue('tp_vericekroller') || []
        cmdType = cmdType.split(' ');
        cmdContent = cmdContent.split(' ');
        let _Permission = []
        let _Roles = []
        cmdType.forEach((a) => {
          _Permission.push(a)
        })
        cmdContent.forEach((a) => {
          _Roles.push(a)
        })
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms ? check.talentPerms.find(cartel => cartel.Commands == cmdName) : undefined
        if(cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
        if((_Roles && !_Roles.some(x => guild.roles.cache.has(x))) || (_Permission && !_Permission.some(x => guild.roles.cache.has(x)))) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen rol veya roller ${guild.name} sunucusunda bulunamadı. ${cevaplar.prefix}` , ephemeral: true })
        }
        await TalentPerms.updateOne({guildID: guild.id}, { $push: {"talentPerms": {
          Name: başHarfBüyült(cmdName),
          Commands: cmdName,
          Permission: _Permission,
          Roles: _Roles,
          Date: Date.now(),
          Author: uye.id,
        }}}, {upsert: true})
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla ${cmdName} komutu <t:${String(Date.now()).slice(0, 10)}:R> eklendi. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })

      }
    })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar.staff.includes(message.member.id) && message.guild.ownerId != message.member.id) return;  
    const embed = new genEmbed()
      let Tp = await TalentPerms.findOne({guildID: message.guild.id})

      let load = await message.reply({
        content: `${message.guild.name} sunucusuna ait rol (ver/al) komut oluşturma sistemi yükleniyor. Lütfen bekleyin!`
      })

      let Row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setEmoji("943265806341513287")
          .setLabel("Komut Oluştur")
          .setCustomId("tp_ekle"),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setEmoji("963743753036791879")
          .setLabel("Komut Bilgileri")
          .setCustomId("tp_bilgileri"),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("943265806547038310")
          .setLabel("Komut Kaldır")
          .setCustomId("tp_kaldır"),
      );
    
      let TalentPerm = Tp.talentPerms
      let komutlar = []
      let komutListe = []
        if(Tp && TalentPerm) {
          TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(x =>  komutlar.push({name: x.Commands, roles: `${x.Roles.map(a => message.guild.roles.cache.get(a) ? message.guild.roles.cache.get(a) : "@rol bulunamadı").join(", ")}`}))
          TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(data => {
            komutListe.push([
              {label: başHarfBüyült(data.Commands), value: data.Commands, emoji: {id: "1023821496025612359"}, description: `${data.Roles.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : "@rol bulunamadı").join(", ")} veriyor.`},
            ])
          })
        }

      load.edit({content: null, embeds: [
        new genEmbed()
        .setDescription(`Aşağıda ${message.guild.name} sunucusuna ait rol (ver/al) komut oluşturma, görüntüleme ve kaldırma işlemi yapabilirsiniz.\n
Sunucuda toplamda ${komutlar.length} alt komut veya rol (ver/al) komutu bulunmakta. Eklemek için aşağıda bulunan "Komut Oluştur" düğmesini kullanabilirsiniz.\n
${komutlar.length > 0 ? `Aşağıda sunucuda bulunan alt komut veya rol (ver/al) komutları listelenmekte:
${komutlar.map(x => `${message.guild.emojiGöster("cartel_arrow")} **${x.name}** (${x.roles})`).join("\n")}` : ``}`)
        .setThumbnail(message.guild.iconURL({extension: 'png'}))
      ],
      components: [Row]
    })
      var filter = (i) => i.user.id == message.member.id
      let collector = load.createMessageComponentCollector({ filter: filter, time: 60000 });
      collector.on('collect', async (i) => {
        if (i.customId == "tp_bilgileri") {
          const modal = new ModalBuilder()
            .setCustomId('tp-detay')
            .setTitle('Alt Komut Bilgi')
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('tp_isim')
                  .setLabel('Komut İsmi')
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(3)
                  .setMaxLength(120)
                  .setPlaceholder('Örn: vip')
                  .setRequired(true)
              )
            );
          await i.showModal(modal);
        }
      
        if (i.customId == "tp_kaldır") {
          const modal = new ModalBuilder()
            .setCustomId('tp-kaldır')
            .setTitle('Alt Komut Kaldırma')
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('tp_isim')
                  .setLabel('Komut İsmi')
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(3)
                  .setMaxLength(120)
                  .setPlaceholder('Örn: vip')
                  .setRequired(true)
              )
            );
          await i.showModal(modal);
        }
      
        if (i.customId == "tp_ekle") {
          const modal = new ModalBuilder()
            .setCustomId('tp-ekle')
            .setTitle('Alt Komut Ekleme')
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('tp_isim')
                  .setLabel('Komut İsmi')
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(3)
                  .setMaxLength(120)
                  .setPlaceholder('Örn: vip')
                  .setRequired(true)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('tp_kullancakroller')
                  .setLabel('Kullanılacak Rol(ler)')
                  .setStyle(TextInputStyle.Paragraph)
                  .setMinLength(3)
                  .setMaxLength(250)
                  .setPlaceholder('Birden fazla için boşluk bırakın.')
                  .setRequired(true)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('tp_vericekroller')
                  .setLabel('Verilecek Rol(ler)')
                  .setStyle(TextInputStyle.Paragraph)
                  .setMinLength(3)
                  .setMaxLength(250)
                  .setPlaceholder('Birden fazla için boşluk bırakın.')
                  .setRequired(true)
              )
            );
          await i.showModal(modal);
        }
      });
      collector.on('end', (collected, reason) => {
          if(reason == "time") {
            Row.components[0].setDisabled(true)
            Row.components[1].setDisabled(true)
            Row.components[2].setDisabled(true)
            
            load.edit({components: [Row], embeds: [
              new genEmbed().setDescription(`Zaman aşımına uğradığı için işleminiz sonlandırıldı. ${cevaplar.prefix}`)
            ]});
            setTimeout(() => {
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
              load.delete().catch(err => {})
            }, 7500)
          }
      })
}

};


function başHarfBüyült(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}