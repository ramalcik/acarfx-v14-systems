const { Collection } = require('discord.js')
const alwaysJoined = new Collection()
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Jails = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const VMutes = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const Mutes = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const Forcebans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Welcome = require('../../../../Global/Databases/Schemas/Others/Guild.Welcome.Settings');
const {VK, DC, STREAM} = require('../../../../Global/Databases/Schemas/Punitives.Activitys');
const { genEmbed } = require('../../../../Global/Init/Embed');
const getInvite = new Collection()
const { ChannelType } = require("discord.js");


 /**
 * @param {Client} client 
 */

client.on("ready", () => {
  setInterval(() => {
    console.log(`[Giriş-Çıkış Temizleme] ${alwaysJoined.length || 0} veri temizlendi.`)
    alwaysJoined.map((çıkgir, id) => {
      alwaysJoined.delete(id)
    })
  }, 1000 * 60 * 60 * 1)

})

module.exports = async (member) => {
    if(member.guild.id != global.sistem.SERVER.ID) return;
    let User = await Users.findOne({ _id: member.id }) 
    let Jail = await Jails.findOne({ _id: member.id });
    let Forceban = await Forcebans.findOne({ _id: member.id });
    let Underworld =  await Punitives.findOne({Member: member.id, Type: "Underworld", Active: true})
    const _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
    const _set = global._set = _findServer.Ayarlar
    let OneWeak = Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7;
    member = member.guild.members.cache.get(member.id)
    let cezaPuan = await member.cezaPuan()
    let amkSürekliÇıkıyoGiriyo = alwaysJoined.get(member.id) || 0
    if(amkSürekliÇıkıyoGiriyo >= 3) {
      let hgKanalı = member.guild.channels.cache.get(_set.hoşgeldinKanalı)
      if(hgKanalı) hgKanalı.send({content: `${member} isimli üye birden fazla **Giriş-Çıkış** işlemi yaptığından dolayı sunucudan uzaklaştırıldı. ${member.guild.emojiGöster(emojiler.Iptal)}`}).then(x => {})
      alwaysJoined.delete(member.id)
      return await member.ban({reason: "Sürekli Çıkış/Giriş işlemi uygulamak."})
    } else {
      if(!member) return;
      let getir = alwaysJoined.get(member.id) || 0
      alwaysJoined.set(member.id, getir + 1)
    }
    if(_set.otoIsim && User && User.Name && User.Names && User.Gender && User.Gender != "Kayıtsız") {
      await member.setNickname(`${_set.type ? member.user.username.includes(_set.tag) ? _set.tag + " " : (_set.tagsiz ? _set.tagsiz + " " : (_set.tag || "")) : ""}${User.Name}`).catch(err => {});    
    } else {
      await member.setNickname(`Kayıtsız`).catch(err => {});
      if(member && member.manageable && _set.type && _set.isimyas) await member.setNickname(`${member.user.username.includes(_set.tag) ? _set.tag : (_set.tagsiz ? _set.tagsiz : (_set.tag || ""))} İsim | Yaş`)
      if(member && member.manageable && !_set.type && _set.isimyas) await member.setNickname(`İsim | Yaş`)
      if(member && member.manageable && !_set.type && !_set.isimyas) await member.setNickname(`Kayıtsız`)
      if(member && member.manageable && _set.type && !_set.isimyas) await member.setNickname(`${member.user.username.includes(_set.tag) ? _set.tag : (_set.tagsiz ? _set.tagsiz : (_set.tag || ""))} Kayıtsız`)
    }
    if(OneWeak) {
        await member.setRoles(_set.şüpheliRolü)
        await member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucuya katıldı fakat hesabı ${global.timeTag(Date.parse(member.user.createdAt))} açıldığı için şüpheli olarak işaretlendi.`);
        return member.guild.kanalBul("şüpheli-log").send({embeds: [new genEmbed().setDescription(`${member} isimli üye sunucuya katıldı fakat hesabı ${global.timeTag(Date.parse(member.user.createdAt))} açıldığı için şüpheli olarak işaretlendi.`)]});
    };
    if(_set.yasakTaglar && _set.yasakTaglar.some(tag => member.user.username.includes(tag) || member.user.discriminator.includes(tag))) {
        await member.setRoles(_set.yasaklıTagRolü)
member.send(`**Merhaba!**
Üzerinizde bulunan **\` ${_set.yasakTaglar.find(x => member.user.username.includes(x) || member.user.discriminator.includes(x))} \`** bu sembol veya etiket yasaklandığı için sizi yasaklı kategorisine ekledik.
\`\`\`
Üzerinizde bulunan yasaklı tag çıkarıldığında kayıtlı iseniz otomatik kayıt olacaksınız kayıtlı değilseniz kayıtsıza tekrardan düşeceksiniz.
\`\`\``).catch(err => {})
        await member.guild.kanalBul("yasaklı-tag-log").send({embeds: [new genEmbed().setDescription(`${member} isimli üye sunucuya katıldı fakat isminde yasaklı tag/etiket barındırdığından dolayı yasaklı olarak işaretlendi.`)]});
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı fakat ismininde \` Yasaklı Tag \` bulundurduğu için cezalı olarak belirlendi.`);
    };
    if(Jail) {
        await member.setRoles(_set.jailRolü)
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı fakat aktif bir cezalandırılması bulunduğu için tekrardan cezalandırıldı.`);
    };
    if(Underworld) {
      await member.setRoles(_set.underworldRolü)
      return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı fakat aktif bir Underworld cezası bulunduğu için tekrardan Underworld'e gönderildi.`);
    };
    if(Forceban) {
        await member.ban({ reason: 'Forceban tarafından yasaklandı.' })
        return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı. fakat Kalkmazban sistemi ile yasaklandığından dolayı sunucumuzda tekrar yasaklandı.`);
    };
    if(cezaPuan >= 50) {
    	await member.setRoles(_set.şüpheliRolü)
	    await member.send({embeds: [new genEmbed().setDescription(`${member.guild.emojiGöster(emojiler.Cezalandırıldı)} ${member} Ceza puanın \`${cezaPuan}\` olduğu için otomatik olarak şüpheli hesap olarak belirlendin.`)]}).catch(x => {});
      return member.guild.channels.cache.get(_set.hoşgeldinKanalı).send(`${member} isimli üye sunucumuza katıldı, Ceza puanı \`50\` üzeri olduğu için şüpheli olarak belirlendi.`);
    }
    if(_set.otoKayıt && User && User.Name && User.Names && User.Gender) {
        if(_set.taglıalım) {
          await rolTanımlama(member,_set.kayıtsızRolleri);
          return hoşgeldinMesajı(member);
        }
        let hosgeldinKanal = member.guild.channels.cache.get(_set.hoşgeldinKanalı)
        let chatKanal = member.guild.channels.cache.get(_set.chatKanalı)
        if(User.Gender == "Erkek") {
            if(hosgeldinKanal) hosgeldinKanal.send({content: `${member.guild.emojiGöster("927298179467198464")} ${member} İsimli Üye Daha Önce **Erkek** Olarak Kayıt Olduğu İçin Otomatik Olarak Kayıt Edildi.`})
            if(chatKanal) chatKanal.send(`:tada: Hoş Geldin ${member} Aramıza Tekrardan Katıldığınız İçin Teşekkür Ederiz.`).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, 12500)
            })
            await Users.updateOne({_id: member.id}, { $push: { "Names": { Name: User.Name, State: `Oto. Bot Kayıt) (${_set.erkekRolleri.map(x => member.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
            return await rolTanımlama(member,_set.erkekRolleri)
        }
        if(User.Gender == "Kadın") { 
            if(hosgeldinKanal) hosgeldinKanal.send({content: `${member.guild.emojiGöster("927298179467198464")} ${member} İsimli Üye Daha Önce **Kadın** Olarak Kayıt Olduğu İçin Otomatik Olarak Kayıt Edildi.`})
            if(chatKanal) chatKanal.send(`:tada: Hoş Geldin ${member} Aramıza Tekrardan Katıldığınız İçin Teşekkür Ederiz.`).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, 12500)
            })
            await Users.updateOne({_id: member.id}, { $push: { "Names": { Name: User.Name, State: `Oto. Bot Kayıt) (${_set.kadınRolleri.map(x => member.guild.roles.cache.get(x)).join(",")}`, Date: Date.now() }}}, {upsert: true})
            return await rolTanımlama(member,_set.kadınRolleri)
        }
    }
    await rolTanımlama(member,_set.kayıtsızRolleri);
    hoşgeldinMesajı(member);

}

client.on('inviteCreate', async invite => {
    invite.guild.invites.fetch().then((guildInvites) => {
        const cacheInvites = new Collection();
        guildInvites.map((inv) => {
          cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
        });
        getInvite.set(invite.guild.id, cacheInvites);
      });
})

client.on('inviteDelete', async invite => {
    setTimeout(async () => {
        invite.guild.invites.fetch().then((guildInvites) => {
          const cacheInvites = new Collection();
          guildInvites.map((inv) => {
            cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
          });
          getInvite.set(invite.guild.id, cacheInvites);
        });
      }, 5000)
})

client.on('ready', async () => {
    const guild = client.guilds.cache.get(sistem.SERVER.ID)
    guild.invites.fetch().then((guildInvites) => {
      const cacheInvites = new Collection();
      guildInvites.map((inv) => {
        cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter });
      });
      getInvite.set(guild.id, cacheInvites);
    });
})

async function hoşgeldinMesajı(member) {
    ayarlar = _set
    const guildInvites = getInvite.get(member.guild.id) || new Collection()
    const invites = await member.guild.invites.fetch();
    const invite = invites.find((inv) => guildInvites.has(inv.code) && inv.uses > guildInvites.get(inv.code).uses) || guildInvites.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
    const cacheInvites = new Collection();
    invites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); });
    getInvite.set(member.guild.id, cacheInvites);
    let davettaslak;
    if (invite === null) {
        davettaslak = `Özel URL`
      } else if (invite === undefined) {
        davettaslak = `Özel URL`
      } else if (!invite) {
        davettaslak = `Özel URL`
      } else if (invite === member.guild.vanityURLCode) { 
        davettaslak = `Özel URL`
      } else {
          davettaslak = member.guild.members.cache.get(invite.inviter.id) ? `${member.guild.members.cache.get(invite.inviter.id)}`: `Özel URL`
      }
      let hoşgeldinKanal = member.guild.channels.cache.get(_set.hoşgeldinKanalı) || member.guild.kanalBul(_set.hoşgeldinKanalı)
      
      let Data = await Welcome.findOne({guildId: member.guild.id})
      if(hoşgeldinKanal) {
        if(Data) {
          let hoşgeldinTextiAmınakodum = Data.Text
            .replace("-tag-", `${ayarlar.tag ? ayarlar.tag : "Tag Bulunamadı!"}`)
            .replace("-sunucu-", `${ayarlar.serverName ? ayarlar.serverName : member.guild.name}`)
            .replace("-üye-", `${member}`)
            .replace("-üyeid-", `${member.id}`)
            .replace("-kişi-", `${global.sayılıEmoji(member.guild.memberCount)}`)
            .replace("-davet-", `${davettaslak}`)
            .replace("-teyitci-", `${_set ? _set.teyitciRolleri ? `${_set.teyitciRolleri.filter(x => member.guild.roles.cache.has(x)).map(x => `<@&${x}>`).join(", ")}` : `@Rol Bulunamadı!` : `@Rol Bulunamadı!`}`)
            .replace("-oluşturma-", `${global.tarihsel(member.user.createdAt)}`)
            .replace("-kaçyıl-", `${global.timeTag(Date.parse(member.user.createdAt))}`)
            .replace("-kurallar-", `${_set.kurallarKanalı ? `<#${_set.kurallarKanalı}>` : member.guild.kanalBul("kurallar")}`)
            .replace("-teyit-", `${member.guild.channels.cache.filter(x => x.parentId == kanallar.registerKategorisi && x.type == ChannelType.GuildVoice).random()}`)
  
          if(Data.Webhook) {
              hoşgeldinKanal.wsend({content: `${hoşgeldinTextiAmınakodum}`});
          } else {
              hoşgeldinKanal.send({content: `${hoşgeldinTextiAmınakodum}`});
          }
        } else {
                 hoşgeldinKanal.send({content: `${member}, ${_set.serverName ? `${_set.serverName}` : member.guild.name} Sunucumuza Hoş Geldin.
Seninle beraber sunucumuz **${global.sayılıEmoji(member.guild.memberCount)}** üye sayısına ulaştı. ${member.guild.emojiGöster(emojiler.Konfeti)}

Hesabın __${global.tarihsel(member.user.createdAt)}__ tarihinde (${global.timeTag(Date.parse(member.user.createdAt))}) oluşturulmuş!
Kayıt işleminden sonra ${_set.kurallarKanalı ? `<#${_set.kurallarKanalı}>` : member.guild.kanalBul("kurallar")} kanalına göz atmayı unutmayın.

${member.guild.channels.cache.filter(x => x.parentId == kanallar.registerKategorisi && x.type == ChannelType.GuildVoice).random()} Kanalına katılarak "${_set.isimyas ? `İsim | Yaş` : `Nick`}" vererek kayıt olabilirsiniz.
Sunucumuza ${davettaslak == "Özel URL" ? `Özel URL ile katıldı. ` : `${davettaslak} tarafından davet edildi. `}${_set.type ? `${_set.taglıalım ? ` **Şuan için taglı alımdayız**, tagımızı alarak veya takviye yaparak bize destek olabilirsiniz. (\`${_set.tag}\`)` : `Tagımızı alarak veya takviye yaparak bize destek olabilirsiniz. (\`${_set.tag}\`)`}` : ``}
\`\`\`
Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız. ${_set.serverName}
\`\`\`
`});
        }
  } else {
    client.logger.log("Lütfen sunucu üzerinden hoşgeldin kanalını belirtin. Bir üye girdi fakat hoşgeldin mesajı atamadım.","error")
  }
        
} 


async function rolTanımlama(üye, rol) {
    let Mute = await Mutes.findOne({ _id: üye.id });
    let Vk = await VK.findOne({_id: üye.id});
    let Dc = await DC.findOne({_id: üye.id});
    let Stream = await STREAM.findOne({_id: üye.id});
    let startRoles = [...rol]

    if(Mute) startRoles.push(_set.muteRolü)
    if(_set.vkCezalıRolü && Vk) startRoles.push(_set.vkCezalıRolü)
    if(_set.dcCezalıRolü && Dc) startRoles.push(_set.dcCezalıRolü)
    if(_set.streamerCezalıRolü && Stream) startRoles.push(_set.streamerCezalıRolü)
    if(_set.type && üye.user.username.includes(_set.tag)) await startRoles.push(_set.tagRolü)
    await üye.roles.set(startRoles).then(async (cartel) => {})
}

module.exports.config = {
    Event: "guildMemberAdd"
};

