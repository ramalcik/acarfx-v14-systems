const { GuildMember, EmbedBuilder, Message, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Roles = require('../../../../Global/Databases/Schemas/Guards/GuildMember.Roles.Backup');
const Discord = require("discord.js")
 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */

module.exports = async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let embed = new genEmbed()
    let uye = newPresence.guild.members.cache.get(newPresence.member.user.id)
    if(!uye) return;
    if(uye.guild.id != global.sistem.SERVER.ID) return;
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: uye.guild.id})
    if(Data && !Data.offlineGuard) return;
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('ver')
        .setEmoji(newPresence.guild.emojiGöster(emojiler.Onay).id)
        .setLabel('Rolleri Geri Ver!')
        .setStyle(ButtonStyle.Secondary),
        )
        const Permissions = [
            PermissionFlagsBits.Administrator,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ManageWebhooks
          ];
        let arr = []
    let Dedection =  Object.keys(newPresence.member.presence.clientStatus);
    let CheckWeb = Dedection.find(x => x == "web");
    let memberSafeRoles =  uye.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
    if(memberSafeRoles) memberSafeRoles.forEach(rol => {
            arr.push(rol.id)
    })
    
    if(uye && uye.presence && uye.presence.status == "offline" && Permissions.some(x => uye.permissions.has(x))) {
        if(await client.checkMember(uye.id)) return; 
        await Roles.updateOne({_id: uye.id}, {$set: {"Roles": arr, Reason: "Çevrimdışı"}}, {upsert: true})
        if(arr && arr.length >= 1) await uye.roles.remove(arr, `Çevrimdışı alındığından dolayı yetkisi çekildi.`).catch(err => {})
        embed.setFooter({ text: "Aktif olduğunda yetkisi tekrardan verilecektir."}).setTitle("Sunucuda Bir Yönetici Çevrim-Dışı Aldı!").setDescription(`${uye} (\`${uye.id}\`) isimli yönetici Çevrim-Dışı oldu özel mesajları kapalı olduğundan dolayı bu kanala bilgilendirme atıldı.\n\`\`\`fix
Üzerinden Alınan Roller \`\`\`\
${arr.length >= 1 ? `\` ••❯ \` Çekilen Roller: ${arr.filter(x => uye.guild.roles.cache.get(x)).map(x => uye.guild.roles.cache.get(x)).join(", ")}` : `\` ••❯ \` Üzerinden herhangi bir rol alınmadı.` } `)
            let loged = newPresence.guild.kanalBul("guard-log");
            if(loged) await loged.send({embeds: [embed]})
    } else if(uye && uye.presence && uye.presence.status != "offline") {
        let Data = await Roles.findOne({_id: uye.id, Reason: "Çevrimdışı"})
        if(Data && Data.Roles && Data.Roles.length) {
            if(Data.Roles) uye.roles.add(Data.Roles, `Aktif olduğundan dolayı çekilen yetkileri tekrardan verildi.`).catch(err => {})
            await Roles.findByIdAndDelete(uye.id)
        }
    }
}

module.exports.config = {
    Event: "presenceUpdate"
}

client.on("presenceUpdate", async (oldPresence, newPresence) => {
    if(!newPresence) return;
    if(!newPresence.member) return;
    let embed = new genEmbed()
    let Dedection =  Object.keys(newPresence.member.presence.clientStatus);
    let uye = newPresence.guild.members.cache.get(newPresence.member.user.id)
    if(!uye) return;
    if(uye.guild.id != global.sistem.SERVER.ID) return;
    const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
    let Data = await Guard.findOne({guildID: uye.guild.id})
    if(Data && !Data.webGuard) return;
    let Row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('ver')
        .setEmoji(newPresence.guild.emojiGöster(emojiler.Onay).id)
        .setLabel('Rolleri Geri Ver!')
        .setStyle(ButtonStyle.Secondary),
    )
    const Permissions = [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageWebhooks
      ];
    let arr = []
    let CheckWeb = Dedection.find(x => x == "web");
    let memberSafeRoles =  uye.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
    if(memberSafeRoles) memberSafeRoles.forEach(rol => {
            arr.push(rol.id)
    })

    if(CheckWeb && Permissions.some(x => uye.permissions.has(x))) {
        if(await client.checkMember(uye.id)) return; 
         await Roles.updateOne({_id: uye.id}, {$set: {"Roles": arr, Reason: "Web tarayıcı girişi için kaldırıldı."}}, {upsert: true})
         if(arr && arr.length >= 1) await uye.roles.remove(arr, `Web üzerinden sunucuyu görüntülediği için.`).catch(err => {})
         embed.setTitle("Bir Yönetici Sunucuya Webden Giriş Sağladı!").setDescription(`${uye} (\`${uye.id}\`) isimli yönetici Web tarayıcısından **Sunucu** ekranına giriş yaptığı için yetkisi çekildi.\n\`\`\`fix
 Üzerinden Alınan Roller \`\`\`\
 ${arr.length >= 1 ? `\` ••❯ \` Çekilen Roller: ${arr.filter(x => uye.guild.roles.cache.get(x)).map(x => uye.guild.roles.cache.get(x).name).join(", ")}` : `\` ••❯ \` Üzerinden herhangi bir rol alınmadı.` } `)
         let loged = newPresence.guild.kanalBul("guard-log");
         if(loged) await loged.send({embeds: [embed], components: [Row]}).then(async (msg) => {
             const tacsahip = await newPresence.guild.fetchOwner();
             const filter = i =>  i.customId == "ver" && (ayarlar.staff.includes(i.user.id) || i.user.id === tacsahip.id)
             const collector = msg.createMessageComponentCollector({ filter, max: 1 })
          
             collector.on('collect', async i => { 
                 if(i.customId == "ver") {
                     let Data = await Roles.findOne({_id: uye.id})
                     if(Data && Data.Roles && Data.Roles.length) {
                         i.reply({content: `${uye.guild.emojiGöster(emojiler.Onay)} ${uye}, üyesinin çekilen rolleri başarıyla geri verildi.`, ephemeral: true})
                         if(Data.Roles) uye.roles.add(Data.Roles, `${i.user.username} tarafından tekrardan verildi.`).catch(err => {})
                         await Roles.findByIdAndDelete(uye.id)
                     } else {
                         i.reply({content: `${uye.guild.emojiGöster(emojiler.Iptal)} ${uye}, üyesinin rolleri veritabanında bulunamadığından işlem sonlandırıldı.`, ephemeral: true})
                     }
                 }
             })
             collector.on('end', c => {
                 msg.edit({embeds: [embed], components: []}).catch(err => {})
             })
         });
         const owner = await newPresence.guild.fetchOwner();
         if(owner) owner.send({embeds: [embed]}).catch(err => {})
         client.processGuard({
            type: "Tarayıcı Girişi!",
            target: uye.id,
        })
 
     } else {
         return;
     }
})

