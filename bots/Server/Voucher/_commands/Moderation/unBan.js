const { Client, Message, EmbedBuilder} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Discord = require("discord.js")
module.exports = {
    Isim: "yargıkaldır",
    Komut: ["yargıkaldır","yargı-kaldır","yargi-kaldir","yargikaldir","unyargı"],
    Kullanim: "yargıkaldır <@cartel/ID>",
    Aciklama: "Belirlenen üyenin yasaklamasını kaldırır.",
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
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])    
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    await Punitives.findOne({Member: uye.id, Type: "Yasaklama", Active: true}).exec(async (err, res) => {
        message.guild.bans.fetch().then(async(yasaklar)=> {
            if(yasaklar.size == 0) return message.channel.send(cevaplar.yasaklamayok)
            let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == uye.id)
            if(!yasakliuye) return message.channel.send(`${cevaplar.prefix} \`Belirtilen Üye Yasaklı Değil!\` lütfen geçerli bir yasaklama giriniz.`);
            if(res) {
                if(res.Staff !== message.author.id && message.guild.members.cache.get(res.Staff) && !ayarlar.staff.includes(message.member.id)) return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${res.Staff ? message.guild.members.cache.get(res.Staff) ? `${message.guild.members.cache.get(res.Staff)} (\`${res.Staff}\`)` : `${res.Staff}` :  `${res.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter({ text: "yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir."})]}).then(x => {
                    message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                });
            }
            if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true })
            await message.guild.members.unban(uye.id);
            let findChannel = message.guild.kanalBul("ban-log");
            if(findChannel) await findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından kaldırıldı.`)]})
            await message.reply(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} yasaklaması kaldırıldı!`);
            message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            message.member.Leaders("ceza", 5, {type: "CEZA", user: uye.id})
            message.member.Leaders("sorun", 5, {type: "CEZA", user: uye.id})
            message.member.Leaders("criminal", 5, {type: "CEZA", user: uye.id})
        })
    })
    }
};