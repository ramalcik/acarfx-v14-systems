const { Client, Message, ButtonBuilder, ButtonStyle,  ActionRowBuilder } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {genEmbed} = require('../../../../Global/Init/Embed');
const Discord = require("discord.js")
module.exports = {
    Isim: "cinsiyet",
    Komut: ["cinsiyet","cindeğiş"],
    Kullanim: "cinsiyet @cartel/ID",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
    Kategori: "teyit",
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
    let regPanelEmbed = new genEmbed();
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.channel.send(cevaplar.noyt).catch(err => {})
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(uye.user.bot) return message.reply(cevaplar.bot).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(!uye.manageable) return message.reply(cevaplar.dokunulmaz).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.reply(cevaplar.yetkiust).then(x => { setTimeout(() => {x.delete().catch(err => {})}, 5000)})
    const genderSelect = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
	                .setCustomId('erkekyaxd')
	                .setLabel('Erkek')
	                .setStyle(ButtonStyle.Secondary)
                    .setEmoji(message.guild.emojiGöster(emojiler.erkekTepkiID).id),
                new ButtonBuilder()
	                .setCustomId('lesbienaq')
	                .setLabel('Kadın')
	                .setStyle(ButtonStyle.Secondary)
                    .setEmoji(message.guild.emojiGöster(emojiler.kadınTepkiID)).id,
                new ButtonBuilder()
	                .setCustomId('iptal')
	                .setLabel('İptal')
	                .setStyle(ButtonStyle.Danger)
                    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
			);
            const filter = i => i.user.id === message.member.id;
            let regPanel = await message.reply({embeds: [regPanelEmbed
            
                .setDescription(`Aşağıda ${uye} isimli üyenin cinsiyetini değiştirmek için düğmeler verilmiştir.
Tekrardan ses teyiti alarak kontrol etmenizi öneririz. Çünkü ses teyiti alırken ses teyiti alınacak üyenin cinsiyeti değişecektir.`)
            ], components: [genderSelect], ephemeral: true} )
            const collector = regPanel.createMessageComponentCollector({ filter, time: 15000 });
            let isimveri = await Users.findById(uye.id) || []
        let isimler = isimveri.Name || `${uye.displayName ? uye.displayName : uye.user.username}`
collector.on('collect', async i => {
	if (i.customId === 'erkekyaxd') {
        await regPanel.edit({ embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye **Erkek** olarak cinsiyet değiştirildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        await uye.roles.remove(roller.kadınRolleri)
        await uye.roles.add(roller.erkekRolleri)
        await Users.updateOne({_id: uye.id}, { $push: { "Names": {Staff: message.member.id, Name: isimler, State: `Cinsiyet Değiştirme) (${roller.erkekRolleri.map(x => uye.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
		message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
	}
    if (i.customId === 'lesbienaq') {
        await regPanel.edit({ embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye **Kadın** olarak cinsiyet değiştirildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        await uye.roles.add(roller.kadınRolleri)
        await uye.roles.remove(roller.erkekRolleri)
        await Users.updateOne({_id: uye.id}, { $push: { "Names": {Staff: message.member.id, Name: isimler, State: `Cinsiyet Değiştirme) (${roller.kadınRolleri.map(x => uye.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
        
		message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
	}
    if (i.customId === 'iptal') {
        await i.deferUpdate();
        regPanel.delete().catch(err => {})
		message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
        
	}
});
collector.on('end', collected => {});
    }
};

