 const Users = require('../../../../Global/Databases/Schemas/Client.Users');
 const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
 const { genEmbed } = require('../../../../Global/Init/Embed');
 const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
 const USERS_COMPONENTS = require('../../../../Global/Databases/Schemas/Users.Components');
 const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
 /**
 * @param {Client} client 
 */

  module.exports = async (oldUser, newUser) => {

    let Row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("onukap")
            .setLabel("İlgilen!")
            .setEmoji("925128103741775892")
            .setStyle(ButtonStyle.Secondary)
    )

    const _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = global.ayarlar = _findServer.Ayarlar
    roller = global.roller = _findServer.Ayarlar
    kanallar = global.kanallar = _findServer.Ayarlar
    let client = oldUser.client;
    let guild = client.guilds.cache.get(sistem.SERVER.ID);
    if(!guild) return;
    let user = guild.members.cache.get(oldUser.id);
    if(!user) return;
    let UserData = await Users.findOne({ _id: user.id });

    let embed = new genEmbed()
    if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
    if ((ayarlar && ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag) || newUser.discriminator.includes(tag))) && (roller.yasaklıTagRolü && !user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.setRoles(roller.yasaklıTagRolü)
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birini kullanıcı adına aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`)
        let kanalYasak = guild.kanalBul("yasaklı-tag-log")
        if(kanalYasak) kanalYasak.send({embeds: [embed.setDescription(`${user} adlı üye ismine <t:${String(Date.now()).slice(0, 10)}:R> yasaklı tag aldığı için jaile atıldı.`)]})
        return;
    };
    if ((ayarlar && ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag) || newUser.discriminator.includes(tag))) && (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için cezalıdaydın ve şimdi bu yasaklı tagı çıkardığın için cezalıdan çıkarıldın!`).catch();
        let yasakKanal = guild.kanalBul("yasaklı-tag-log")
        if(yasakKanal) yasakKanal.send({embeds: [embed.setDescription(`${user} adlı üye ismine <t:${String(Date.now()).slice(0, 10)}:R> yasaklı tagı çıkarttığı için cezalıdan çıkartıldı!`).setColor("Green")]})
        if(!ayarlar.taglıalım && UserData && UserData.Name && UserData.Names && UserData.Gender) {
            if(user && user.manageable) await user.setNickname(`${UserData.Name}`)
            if(UserData.Gender == "Erkek") await user.setRoles(roller.erkekRolleri)
            if(UserData.Gender == "Kadın") await user.setRoles(roller.kadınRolleri)
            if(UserData.Gender == "Kayıtsız") user.setRoles(roller.kayıtsızRolleri)
        } else {
            user.setRoles(roller.kayıtsızRolleri)
            if(user && user.manageable) await user.setNickname(`Kayıtsız`)
        }

    };

    
    if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(tag => newUser.username.includes(tag))){
        let data = await Users.findOne({_id: user.id})
        if(data && data.Staff) {
            user.removeStaff()
            let yetkiliRol = guild.roles.cache.get(roller.altilkyetki);
            await user.roles.remove(user.roles.cache.filter(rol => yetkiliRol.position <= rol.position && rol.id != roller.boosterRolü)).catch(err =>{});
        }
    }


    if(ayarlar.type && newUser.username.includes(ayarlar.tag) && !user.roles.cache.has(roller.tagRolü)){
        let addTagLog = guild.kanalBul("tag-log")
        if(addTagLog) addTagLog.send({embeds: [embed.setDescription(`${user} üyesi ismine **\` ${ayarlar.tag} \`** sembolünü <t:${String(Date.now()).slice(0, 10)}:R> aldı ve <@&${roller.tagRolü}> ailemize katıldı!

Son kazanılan taglıdan sonra anlık taglı sayımız **${user.guild.members.cache.filter(x => x.user.username.includes(ayarlar.tag)).size}** üye oldu.`).setColor("Green")]});

    if(user.manageable) user.setNickname(user.displayName.replace(ayarlar.tagsiz, ayarlar.tag))
        if (roller.jailRolü && user.roles.cache.has(roller.jailRolü)) return;
        if (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü)) return;
        if (roller.underworldRolü && user.roles.cache.has(roller.underworldRolü)) return;
        await GUILD_SETTINGS.updateOne({guildID: guild.id}, {$set: {[`Caches.lastTagged`]: user.id}}, {upsert: true})
        user.roles.add(roller.tagRolü).catch();

    } else if(ayarlar.type && !newUser.username.includes(ayarlar.tag) && user.roles.cache.has(roller.tagRolü)){
        let removeTagLog = guild.kanalBul("tag-log")
        if(removeTagLog) removeTagLog.send({embeds: [
            embed.setDescription(`${user} üyesi isminden **\` ${ayarlar.tag} \`** sembolünü <t:${String(Date.now()).slice(0, 10)}:R> kaldırdı ve <@&${roller.tagRolü}> ailemizden ayrıldı!
Anlık olarak üzerinden <@&${roller.altilkyetki}> üzerinde ki tüm roller kaldırıldı.

Son çıkartılan taglıdan sonra **${user.guild.members.cache.filter(x => x.user.username.includes(ayarlar.tag)).size}** taglı kaldı.`).setColor("Red")],
        components: [
            Row
        ]}).then((msg) => {
            let collector = msg.createMessageComponentCollector({max: 1})
            collector.on('collect', async (i) => {
                let kapan = user.guild.members.cache.get(i.user.id)
                if(kapan) {
                    Row.components[0].setDisabled(true)
                    Row.components[0].setLabel(`${kapan.user.username}`)
                    Row.components[0].setStyle(ButtonStyle.Success)
                    msg.edit({components: [Row]})
                    user.send({content: `Merhaba! ${user}
Sunucumuz da tag bıraktığınız için çok üzgünüz. Neden bıraktığınızı bilmiyoruz bizlere belirtmek ister misiniz?
O zaman bana ${kapan} (${kapan.user.username} | ${kapan.id}) yazarsanız derdinize deva olabiliriz.`}).then(a => {
                        i.reply({content: `Başarıyla ${user} üyesine tagı bıraktığı için DM üzerinden mesaj ile bildirildi. Yine de sen yazmak ister misin?`, ephemeral: true})
                    }).catch(async (err) => {
                        removeTagLog.send(`Merhaba! ${kapan},
Kapmaya çalıştığınız üyenin **DM** kapalı olduğu için ben mesaj gönderemedim. Arkadaş ekleyip sen atmak ister misin?`);
                        await i.deferUpdate().catch(err => {});
                    })
                    kapan.Leaders("tag", 5.00, {type: "TAG_CHECK", user: user.id})
                    await USERS_COMPONENTS.updateOne({_id: kapan.id}, {$push: {"Checks": {
                        target: user.id,
                        date: Date.now(),
                        type: "TAG"
                    }}}, {upsert: true})
                    
                }
            })
        });
        if (roller.jailRolü && user.roles.cache.has(roller.jailRolü)) return;
        if (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü)) return;
        if (roller.underworldRolü && user.roles.cache.has(roller.underworldRolü)) return;
        user.removeTagged()
        user.removeStaff()
        if(ayarlar.taglıalım && !user.roles.cache.has(roller.boosterRolü)) {
            await user.voice.disconnect().catch(err => {})
            if(user && user.manageable && ayarlar.type && ayarlar.isimyas) await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
            if(user && user.manageable && !ayarlar.type && ayarlar.isimyas) await user.setNickname(`İsim | Yaş`)
            if(user && user.manageable && !ayarlar.type && !ayarlar.isimyas) await user.setNickname(`Kayıtsız`)
            if(user && user.manageable && ayarlar.type && !ayarlar.isimyas) await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`)
            return await user.setRoles(roller.kayıtsızRolleri)   
        }
        await user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.tagsiz)).catch(err =>{})
        let tagRol = guild.roles.cache.get(roller.tagRolü);
        await user.roles.remove(user.roles.cache.filter(rol => tagRol.position <= rol.position && rol.id != roller.boosterRolü)).catch(err =>{});

    }
  }
  
  module.exports.config = {
      Event: "userUpdate"
  };