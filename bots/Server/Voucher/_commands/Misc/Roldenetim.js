const Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "roldenetle",
    Komut: ["rol-denetle","roldenetim","rol-denetim"],
    Kullanim: "roldenetim <Rol-ID>",
    Aciklama: "Belirtilen bir rolün üyelerinin seste olup olmadığını ve rol bilgilerini gösterir.",
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
    let embed = new genEmbed()
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Adminisrator)) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name.includes(args[0])) || message.guild.rolBul(args[0])
      if (!role) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
      let unVoice = role.members.filter(member => !member.voice.channel);
      let list = 1
      let veri = `${tarihsel(Date.now())} Tarihinde ${message.member.user.username} tarafından istenmiştir!\n` + role.members.map((e) => e ? `#${list++} ••❯ ID: ${e.id} - İsim: ${e.displayName} - ${e.voice.channel ? "Seste" : "Seste Değil"}` : "sa").join("\n")
      message.member.Leaders("rol", 0.01, {type: "ROLE", role: role.id, channel: message.channel.id})
      await message.channel.send({
      content: `\` ••❯ \` Aşağıda <t:${String(Date.now()).slice(0, 10)}:R> istenen **${role.name}** isimli rol bilgisi ve rol denetimi belirtilmiştir. (**Dosya içerisinde genel seste olan olmayan olarak üyeleri listelenmiştir.**)
${Discord.Formatters.codeBlock("fix", "Rol: " + role.name + " | " + role.id + " | " + role.members.size + " Toplam Üye | " + unVoice.size + " Seste Olmayan Üye")}`,
      files: [{
         attachment: Buffer.from(veri),
         name: `${role.id}-genelbilgisi.txt`
     }]})
      message.channel.send(`Aşağıda **${role.name}** (\`${role.id}\`) isimli rolünün seste olmayan üyeleri sıralandırılmıştır.`).then(xx => {
         const arr = splitMessages(`${unVoice.map(e => `<@${e.id}>`).join(", ")}`, { maxLength: 1950, char: "," });
         arr.forEach(element => {
            message.channel.send({ content: `${element}`});
         });
      })
      function splitMessages(text, options = {}) {
         const maxLength = options.maxLength || 2000;
         const char = options.char || "\n";
         const messages = [];
         
         const lines = text.split(char);
         let currentMessage = "";
         let currentLength = 0;
         
         for (const line of lines) {
           if (currentLength + line.length + char.length <= maxLength) {
             currentMessage += line + char;
             currentLength += line.length + char.length;
           } else {
             messages.push(currentMessage);
             currentMessage = line + char;
             currentLength = line.length + char.length;
           }
         }
         
         if (currentMessage.length > 0) {
           messages.push(currentMessage);
         }
         
         return messages;
       }
   }
};