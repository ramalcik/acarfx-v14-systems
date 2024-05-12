const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "cezaişlemleri",
    Komut: ["ceza-işlemleri","cezakontrol"],
    Kullanim: "cezaişlemleri <@cartel/ID>",
    Aciklama: "Belirlenen veya komutu kullanan kişi belirlediği yetkili sayısını ve en son belirlediği yetkili sayısını gösterir.",
    Kategori: "kurucu",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    uye = message.guild.members.cache.get(uye.id)
    let atılanCezalar = await Punitives.find({Staff: uye.id})
    if(!atılanCezalar) return message.reply({content: `${cevaplar.prefix} ${uye} isimli üyenin daha önce yaptırım uyguladığı ceza-i işlem bulunamadı.`});
    let cezalar = atılanCezalar
  //  atılanCezalar.forEach(ceza => cezalar.push({No: ceza.No, Type: ceza.Type, Member: ceza.Member, Reason: ceza.Reason, Date: ceza.Date}))
    let Row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId("last25")
      .setLabel("Son 25 Yaptırımları")
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId("bans")
      .setLabel("📛 Yasaklamalar")
      .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
      .setCustomId("jails")
      .setLabel("🚫 Cezalandırmalar")
      .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
      .setCustomId("mutes")
      .setLabel("🔇 Susturmalar")
      .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
      .setCustomId("warns")
      .setLabel("🔔 Uyarılar")
      .setStyle(ButtonStyle.Primary),
    )
    await message.channel.send({embeds: [new genEmbed().setDescription(`:x: Aşağı da **${uye.user.username}** (${uye}) isimli üyesi(yetkilisi) tarafından yaptırım uygulanan cezalar listelenmektedir, düğmelerden tarafınca yaptırım uygulanan ceza türünü seçerek listeleyebilirsiniz.`)], components: [Row]}).then(async (msg) => {
      const filter = i => i.user.id == message.member.id 
      const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], time: 60000 })
      collector.on("collect", async (i) => {
        if(i.customId == "last25") {
         await msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`:tada: Aşağı da **${uye.user.username}** (${uye}) üyesinin son 25 yaptırım uygulanan cezaları listelenmekte.\n\n${cezalar.slice(0, 25).sort((a, b) => b.Date - a.Date ).filter(x => x.No != "-99999").map((value, index) => `\` #${value.No} (${value.Type}) \` ${message.guild.members.cache.has(value.Member) ? message.guild.members.cache.get(value.Member) : `<@${value.Member}>`} üyesine \`${tarihsel(value.Date)}\` tarihinde ceza-i işlem uygulandı.`).join("\n")}`)]}).catch(err => {}),await i.deferUpdate().catch(err => {})
        }
        if(i.customId == "bans") {
            await msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`:tada: Aşağı da **${uye.user.username}** (${uye}) üyesinin son yasakladığı 15 üye listelenmektedir.\n\n${cezalar.filter(x => x.Type == "Yasaklama" || x.Type == "Kalkmaz Yasaklama" || x.Tpye == "Underworld" ).length > 0  ? cezalar.slice(0, 15).sort((a, b) => b.Date - a.Date ).filter(x => x.Type == "Yasaklama" || x.Type == "Kalkmaz Yasaklama" ).map((value, index) => `\` #${value.No} \` ${message.guild.members.cache.has(value.Member) ? message.guild.members.cache.get(value.Member) : `<@${value.Member}>`} üyesine **${value.Reason}** sebebiyle \`${tarihsel(value.Date)}\` tarihinde yasakladı.`).join("\n"): "Daha önce yaptırım uygulanan yasaklama bulunamadı." }`)]}).catch(err => {}),await i.deferUpdate().catch(err => {})
        }
        if(i.customId == "jails") {
            await msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`:tada: Aşağı da **${uye.user.username}** (${uye}) üyesinin son cezalandırdığı 15 üye listelenmektedir.\n\n${cezalar.filter(x => message.guild.members.cache.has(x.Member) && x.Type == "Cezalandırılma" ).length > 0 ? cezalar.slice(0, 15).sort((a, b) => b.Date - a.Date ).filter(x => message.guild.members.cache.has(x.Member) && x.Type == "Cezalandırılma" ).map((value, index) => `\` #${value.No} \` ${message.guild.members.cache.has(value.Member) ? message.guild.members.cache.get(value.Member) : `<@${value.Member}>`} üyesine **${value.Reason}** sebebiyle \`${tarihsel(value.Date)}\` tarihinde cezalandırıldı.`).join("\n"): "Daha önce yaptırım uygulanan cezalandırma bulunamadı." }`)]}).catch(err => {}),await i.deferUpdate().catch(err => {})
        }
        if(i.customId == "mutes") {
            await msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`:tada: Aşağı da **${uye.user.username}** (${uye}) üyesinin son susturduğu 15 üye listelenmektedir.\n\n${cezalar.filter(x => message.guild.members.cache.has(x.Member) && (x.Type == "Ses Susturulma" || x.Type == "Metin Susturulma") ).length > 0 ? cezalar.slice(0, 15).sort((a, b) => b.Date - a.Date ).filter(x => message.guild.members.cache.has(x.Member) && (x.Type == "Ses Susturulma" || x.Type == "Metin Susturulma") ).map((value, index) => `\` #${value.No} \` ${message.guild.members.cache.has(value.Member) ? message.guild.members.cache.get(value.Member) : `<@${value.Member}>`} üyesine **${value.Reason}** sebebiyle \`${tarihsel(value.Date)}\` tarihinde ${value.Type == "Ses Susturulma" ? "ses kanallarında susturuldu" : "metin kanallarında susturuldu" }.`).join("\n"): "Daha önce yaptırım uygulanan susturulma bulunamadı." }`)]}).catch(err => {}),await i.deferUpdate().catch(err => {})
        }
        if(i.customId == "warns") {
            await msg.edit({embeds: [new genEmbed().setColor("Random").setDescription(`:tada: Aşağı da **${uye.user.username}** (${uye}) üyesinin son uyardığı 15 üye listelenmektedir.\n\n${cezalar.filter(x => message.guild.members.cache.has(x.Member) && x.Type == "Uyarılma" ).length > 0 ? cezalar.slice(0, 15).sort((a, b) => b.Date - a.Date ).filter(x => message.guild.members.cache.has(x.Member) && x.Type == "Uyarılma" ).map((value, index) => `\` #${value.No} \` ${message.guild.members.cache.has(value.Member) ? message.guild.members.cache.get(value.Member) : `<@${value.Member}>`} üyesine **${value.Reason}** sebebiyle \`${tarihsel(value.Date)}\` tarihinde uyarıldı.`).join("\n"): "Daha önce yaptırım uygulanan uyarma bulunamadı." }`)]}).catch(err => {}),await i.deferUpdate().catch(err => {})
        }
      })
      collector.on('end', i => {
          msg.delete().catch(err => {})
      })
    }).catch(err => {})
  }
};

