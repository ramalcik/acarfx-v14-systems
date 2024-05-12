const { Client, Message, Util} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const { genEmbed } = require('../../../../Global/Init/Embed')
const Discord = require("discord.js")
module.exports = {
    Isim: "yasak-tag",
    Komut: ["yasaklı-tag","yasaktag","yasaklıtag","yasaklıtaglar","yasaktaglar","yasaklı-taglar"],
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
      let embed = new genEmbed()
        let data = await GUILDS_SETTINGS.findOne({guildID: sistem.SERVER.ID})
        let ayar = data.Ayarlar
        if (["ekle", "Ekle", "add", "Add","at"].some(kontrol => kontrol === args[0])) {
			let tags = args[1];
            if(!tags) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined); 
			if (ayar.yasakTaglar && ayar.yasakTaglar.includes(tags)) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} Eklemeye çalıştığınız \`${tags}\` zaten yasaklı tag/etiket listesinde.`)]}).then(x => {
                setTimeout(() => {
                    x.delete()
                }, 7500);
            }),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
			
            GUILDS_SETTINGS.findOne({guildID: sistem.SERVER.ID}, async (err, res) => {
                let yasakTags = []
                if(ayar.yasakTaglar) yasakTags = [...ayar.yasakTaglar]
                    yasakTags.push(tags)
                    await GUILDS_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.yasakTaglar": yasakTags}},{upsert: true})

                    let uyeler = message.guild.members.cache.filter(u => u.user.username.includes(tags) || u.user.discriminator.includes(tags))
					await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar/etiketler listesine ekledin.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bu tagda veya etikette bulunan üyeler: ${uyeler.map(x => x).slice(0,7).join(", ")} ${uyeler.size > 7 ? `ve ${uyeler.size - 7} daha fazlası...` : ''}`)]}).then(x => {
    setTimeout(() => {
        x.delete()
    }, 7500);
})
message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
					uyeler.forEach(async (uye, index) => {
						setTimeout(async () => {
                 
                            uye.send(`**Merhaba!**
Üzerinizde bulunan **\` ${args[1]} \`** bu sembol veya etiket yasaklandığı için sizi yasaklı kategorisine ekledik.
\`\`\`
Üzerinizde bulunan yasaklı tag çıkarıldığında kayıtlı iseniz otomatik kayıt olacaksınız kayıtlı değilseniz kayıtsıza tekrardan düşeceksiniz.
\`\`\``).catch(err => {})
							await uye.setRoles(roller.yasaklıTagRolü).catch(() => {})
						}, 1500)
					});
				
			})
		}
        if (["kaldır", "sil", "remove", "delete", "Sil","çıkar","Çıkart"].some(kontrol => kontrol === args[0])) {
            let tags = args[1];
            if(!tags) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined);
            if (ayar.yasakTaglar && !ayar.yasakTaglar.includes(tags)) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} Eklemeye çalıştığınız \`${tags}\` zaten yasaklı tag/etiket listesinde bulunmuyor.`)]}).then(x => {
                setTimeout(() => {
                    x.delete()
                }, 7500);
            }),message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
            const findUser = ayar.yasakTaglar.find(cartel => cartel == tags);
            await GUILDS_SETTINGS.updateOne({ guildID: message.guild.id }, { $pull: { "Ayarlar.yasakTaglar": findUser } }, { upsert: true })
            let uyeler = message.guild.members.cache.filter(u => u.user.username.includes(tags) || u.user.discriminator.includes(tags))
            await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar/etiketler listesinden çıkarttınız.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bu tagda veya etikette bulunan üyeler: ${uyeler.map(x => x).slice(0,7).join(", ")} ${uyeler.size > 7 ? `ve ${uyeler.size - 7} daha fazlası...` : ''}`)]}).then(x => {
setTimeout(() => {
x.delete()
}, 7500);
})
message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            uyeler.forEach(async (uye, index) => {
                setTimeout(async () => {
                    uye.send(`**Merhaba!**
Üzerinizde bulunan **\` ${args[1]} \`** bu sembol veya etiket yasağı kaldırıldığından dolayı sizi yasaklı kategorisinden çıkarttık.`).catch(err => {})
                    let User = await Users.findOne({_id: uye.id});
                    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
                        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) uye.setNickname(`${ayarlar.type ? uye.user.username.includes(ayarlar.tag) ? ayarlar.tag + " " : (ayarlar.tagsiz ? ayarlar.tagsiz + " " : (ayarlar.tag || "")) : ""}${User.Name}`)
                        if(User.Gender == "Erkek") await uye.setRoles(roller.erkekRolleri).catch(err => {})
                        if(User.Gender == "Kadın") await uye.setRoles(roller.kadınRolleri).catch(err => {})
                        if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri).catch(err => {})
                        if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü).catch(err => {})
                    } else {
                        uye.setRoles(roller.kayıtsızRolleri).catch(err => {})
                        if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                        if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`)
                        if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`)
                        if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
                    }
                }, 1500)
            });
            };

    if(!args[0]) {
        message.reply({embeds: [embed.setAuthor(null).setFooter({ text: `${sistem.botSettings.Prefixs[0]}yasaktag <[ekle/kaldır]> <[tag]>`}).setDescription(`**Merhaba!** ${message.member.user.username}
**${message.guild.name}** sunucusuna ait yasaklı tag/etiket listesi aşağıda belirtilmiştir.

**Yasaklı taglar/etiketler sıralanmaktadır**:
${ayar.yasakTaglar ? ayar.yasakTaglar.map(x => {
    return {
        Id: x,
        Total: message.guild.members.cache.filter(u => u.user.username.includes(x))
    };
}).sort((a, b) => b.Total - a.Total).splice(0, 15).map((user, index) => `\`${index + 1}.\` **${user.Id}** (\`${user.Total.size} üye\`)`).join("\n") || `\`\`\`fix
Yasaklı tag/etiket bulunamamıştır.\`\`\`` : `\`\`\`fix
Yasaklı tag/etiket bulunamamıştır.\`\`\``}`)]}).then(x => {
    setTimeout(() => {
        x.delete()
    }, 30000);
})
    }
    
    }
};