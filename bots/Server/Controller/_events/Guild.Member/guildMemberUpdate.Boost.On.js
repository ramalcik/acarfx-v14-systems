const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');

module.exports = async (member) => {
    await client.Economy.updateBalance(member.id, 1, "add", 0)
    let kanalBul = member.guild.kanalBul(kanallar.chatKanalı)
    if(kanalBul) {
        kanalBul.send({content: `${member}, Sunucumuza takviye yaptığınız için teşekkür ederiz.
Bizde sana ufak bir hediye vermek istedik. **+1 Altın**
Ayrıca sunucumuzda bulunan ${member.guild.channels.cache.filter(x => !x.name.includes("log") && (x.name.includes("rol-al") || x.name.includes("rol-alma"))).map(x => x).join(", ")} kanallarına göz atmayı unutma.`}).then(x => {
    setTimeout(() => {
        x.delete().catch(err => {})
    }, 7500);
})
    }
}

module.exports.config = {
    Event: "guildMemberBoost"
}