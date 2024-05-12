const { Client, Collection, Constants, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Options} = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const Discord = require("discord.js")
const fs = require('fs')
const Query = require("./Distributors.Query");
const sistem = global.sistem = require('../Settings/_system.json');
const GUILD_ROLE_DATAS = require("../Databases/Schemas/Guards/Backup/Guild.Roles")
const { GUILD } = require('../../Global/Init/Settings');
// SENKRON
const GUARD_SETTINGS = require('../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../Global/Databases/Schemas/Global.Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT
const request = require('request');
const { bgBlue, black, green } = require("chalk");
const EventEmitter = require('events');

class cartel extends Client {
      constructor (...options) {
            super({
                options,
                intents: [
                    Object.keys(GatewayIntentBits)
                ],
                makeCache: Options.cacheWithLimits({
                    MessageManager: 2000,
                    PresenceManager: 50000,
                }),
            });
            Object.defineProperty(this, "location", { value: process.cwd() });
            this.sistem = this.system = require('../Settings/_system.json');
            GUILD.fetch(this.sistem.SERVER.ID)
            this.users.getUser = GetUser;
            this.getUser = GetUser;
            async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
            this.logger = require('../Functions/Logger');
            this.genEmbed = global.genEmbed = require('../Init/Embed');
            require('../Functions/Dates');
            require('../Functions/Numbers');
            require('../Prototypes/_sources');
            this.Upstaffs = {}
            this._statSystem = global._statSystem = {}
            require('../Prototypes/_user');
            this.botName;
            this.commands = new Collection();
            this.aliases = new Collection();
            this.setMaxListeners(10000);
            this.Distributors = global.Distributors = [];
            this.eventEmitter = new EventEmitter();
            this.Economy = require('../Plugins/Economy/_index');
	     
            
        }

        async fetchCommands(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_commands/${dir}/${file}`);
                    if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                    this.commands.set(referans.Isim, referans);
                    if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
                });
            });
        }
    
        async fetchEvents(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_events/${dir}/${file}`);
                    this.on(referans.config.Event, referans);
                });
            });
        }
        
       async startDistributors() {
                    let Data = await GUARD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
                    if(Data && Data.urlSpam && Data.spamURL && (Data.selfTokens && Data.selfTokens.length > 0)) {
                        let guild = this.guilds.cache.get(global.sistem.SERVER.ID)
                        setInterval(async () => {
                            Data = await GUARD_SETTINGS.findOne({guildID: guild.id})
                            if(Data && !Data.urlSpam && (Data.selfTokens && Data.selfTokens.length < 0)) return;
                            if(!guild) return 
                            if (guild.vanityURLCode && (guild.vanityURLCode == Data.spamURL)) return;
                            let log = this.channels.cache.find(x => x.name.includes("guard") || x.name == "guard-log")
                            if(log) log.send({content: `@everyone`,embeds: [
                                new EmbedBuilder()
                                    .setColor("Random")
                                    .setAuthor({name: guild.name, iconURL: guild.iconURL({dynmaic: true})})
                                    .setDescription(`**${guild.name}** sunucusunun **Özel URL** değiştiğinden dolayı güvenlik amacıyla sistem üzerinde belirlenen "${Data.spamURL}" urlsi otomatik olarak tekrar güncellendi.`)
                                    .setFooter({text: `Synl.io > Genel Bot Ayarları > Güvenlik Ayarları > URL Tekrarlayıcı | Tarafından Bu Ayarları Kontrol Edebilirsiniz.`, iconURL: "https://cdn.discordapp.com/attachments/1034818711921643560/1049216437727801414/favicon.png"})
                            ]})
                            Data.selfTokens.map(self_token => {
                                request({method: "PATCH", url: `https://discord.com/api/v9/guilds/${guild.id}/vanity-url`,
                                headers: { 
                                    "Authorization": `${self_token}`,
                                    "User-Agent": `Discordbot cartel`,
                                    "Content-Type": `application/json`,
                                    "X-Audit-Log-Reason": `URL Tekrarlayici`
                                },
                                body: { "code": Data.spamURL },
                                json: true
                            });
                            
                            })
                        }, 1000);
                    } 
            sistem.TOKENS.SECURITY.DISTS.forEach(async (token) => {
                let botClient = new Client({
                    intents: [
                        Object.keys(GatewayIntentBits)
                    ],
                    presence: { status: "invisible" }
                  });
                  botClient.on("ready", async () => {
                    let guild = botClient.guilds.cache.get(global.sistem.SERVER.ID);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${botClient.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return 
                    }
                    this.logger.log(`${botClient.user.username} isimli dağıtıcı başarıyla aktif oldu.`, "dist")
                    Distributors.push(botClient)
                    botClient.queryTasks = new Query();
                    botClient.queryTasks.init(1000);
                  })
                  await botClient.login(token).catch(err => {
                    this.logger.log(`${black.bgHex('#D9A384')("Dağıtıcı Token Arızası" + ` : ${token}`)}`,"error")
                  })
            })
        }

        closeDistributors() { 
            if(this.Distributors && this.Distributors.length) {
                if(this.Distributors.length >= 1) {
                    this.Distributors.forEach(x => {
                        x.destroy()
                    })
                }
            }
        }

        async checkMember(id, type, process = "İşlem Bulunamadı.") {
            let guild = this.guilds.cache.get(sistem.SERVER.ID)
            if(!guild) return false;
            let uye = guild.members.cache.get(id)
            if(!uye) return;
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            if(!Sunucu) return false;
            if(!Whitelist) return false;
            let guildSettings = Sunucu.Ayarlar
            if(!guildSettings) return false;
            if(!Whitelist.guildProtection) return true;
            if(uye.id === this.user.id || uye.id === uye.guild.ownerId || Whitelist.unManageable.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.BOTS.some(g => uye.id === g || uye.roles.cache.has(g))|| guildSettings.staff.includes(uye.id)) return true; 
            if(!type) return false;
            switch (type) {
                case "guild": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.guildAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "emoji": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.emojiAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "bot": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.botAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "member": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.memberAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "channels": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.channelsAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "roles": {
                    if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))  || Whitelist.rolesAcess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
            }
            return false;
        }


        async checkProcessLimit(uye, limit, zaman, process) {
            let id = uye.id
            let limitController = dataLimit.get(id) || []
            let type = { _id: id, proc: process, date: Date.now() }
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            if(!Whitelist.limit) return true;
            limitController.push(type)
            dataLimit.set(id, limitController)
            setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
            if (limitController.length >= limit) { 
                let loged = uye.guild.kanalBul("guard-log");
                let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                let guildSettings = Sunucu.Ayarlar
                if(Sunucu && guildSettings) {
                    guildSettings.staff.forEach(x => {
                        let botOwner = uye.guild.members.cache.get(x)
                        if(botOwner) botOwner.send(taslak).catch(err => {})
                    })
                }
                let taç = uye.guild.members.cache.get(uye.guild.ownerId)
                if(taç) taç.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
        }    

        async queryManage(oldData, newData) {
            const guildSettings = require('../Databases/Schemas/Global.Guild.Settings');
            let veriData = await guildSettings.findOne({ guildID: sistem.SERVER.ID })
            let sunucuData = veriData.Ayarlar
            if(sunucuData) {              
                if(oldData === sunucuData.tagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.tagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.muteRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.muteRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.jailRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.jailRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.şüpheliRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.şüpheliRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.yasaklıTagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.yasaklıTagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.vipRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.vipRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.Katıldı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.Katıldı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.altilkyetki) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.altilkyetki": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.etkinlikKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.etkinlikKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.cekilisKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.cekilisKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.TerfiLog) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.TerfiLog": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.kurallarKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.kurallarKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.hoşgeldinKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.hoşgeldinKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.chatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.chatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.toplantıKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.toplantıKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.davetKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.davetKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.publicKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.publicKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.registerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.registerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.streamerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.streamerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.photoChatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.photoChatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.sleepRoom) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.sleepRoom": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.başlangıçYetki) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.başlangıçYetki": newData}}, {upsert: true})
                }
                if(sunucuData.erkekRolleri && sunucuData.erkekRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.erkekRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.erkekRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kadınRolleri && sunucuData.kadınRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kadınRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kadınRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kayıtsızRolleri && sunucuData.kayıtsızRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kayıtsızRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kayıtsızRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.Yetkiler && sunucuData.Yetkiler.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.Yetkiler": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.Yetkiler": newData}}, {upsert: true})
                }
                if(sunucuData.teyitciRolleri && sunucuData.teyitciRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.teyitciRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.teyitciRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kurucuRolleri && sunucuData.kurucuRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kurucuRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kurucuRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.ayrıkKanallar && sunucuData.ayrıkKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.ayrıkKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.ayrıkKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.izinliKanallar && sunucuData.izinliKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.izinliKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.izinliKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.rolPanelRolleri && sunucuData.rolPanelRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.rolPanelRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.rolPanelRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.üstYönetimRolleri && sunucuData.üstYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.üstYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.üstYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.altYönetimRolleri && sunucuData.altYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.altYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.altYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.yönetimRolleri && sunucuData.yönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.yönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.yönetimRolleri": newData}}, {upsert: true})
                }

                if(sunucuData.banHammer && sunucuData.banHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.banHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.banHammer": newData}}, {upsert: true})
                }
                if(sunucuData.jailHammer && sunucuData.jailHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.jailHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.jailHammer": newData}}, {upsert: true})
                }
                if(sunucuData.voiceMuteHammer && sunucuData.voiceMuteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.voiceMuteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.voiceMuteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.muteHammer && sunucuData.muteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.muteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.muteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.warnHammer && sunucuData.warnHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.warnHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.warnHammer": newData}}, {upsert: true})
                }
                if(sunucuData.coinChat && sunucuData.coinChat.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.coinChat": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.coinChat": newData}}, {upsert: true})
                }

                
            }
        }
        rolVer(sunucu, role) {
            let length = (sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).array().length + 5);

            const sayı = Math.floor(length / Distributors.length);
           if(sayı < 1) sayı = 1
  
            let Dists = Distributors.length;
            let countUser = length % Dists;
            let uyelercik = []
            sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).map(x => {
                uyelercik.push(x.id)
            })
            Distributors.forEach((guard, _index) => {
              const members = uyelercik.splice(0, (_index == 0 ? sayı + countUser : sayı));
              if (members.length <= 0) return client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`, "log");
              guard.queryTasks.query(async () => {
                  return new Promise(async (resolve) => { 
                      for (let index = 0; index < members.length; index++) {
                          if(!role) {
                              client.logger.log(`[${role}] - ${bot.user.username} - Rol Silindi Dağıtım İptal`, "log");
                              break;
                          }
                          let uyeid = members[index];
                          let uye = guard.guilds.cache.get(global.sistem.SERVER.ID).members.cache.get(uyeid)
                          if (!uye || (uye && uye.roles.cache.has(role.id))) continue;
                          await uye.roles.add(role.id).catch(() => {
                              client.logger.log(`${uye.user.username} - Üyesine rol verilemedi.`, "log");
                          })
                      }
                      resolve();
                  })
                })
                function sleep(ms) {
                  return new Promise(resolve => setTimeout(resolve, ms));
                }
              })
          }
  
          rolKur(role, newRole) {
            GUILD_ROLE_DATAS.findOne({ roleID: role }, async (err, data) => {
              let length = data.members.length
              const sayı = Math.floor(length / Distributors.length);
             if(sayı < 1) {
                const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SERVER.ID).channels.cache.get(e.id))
                for await (const perm of channelPerm) {
                  const bott = Distributors[0]
                  const guild2 = bott.guilds.cache.get(sistem.SERVER.ID)
                  let kanal = guild2.channels.cache.get(perm.id);
                  let newPerm = {};
                  perm.allow.forEach(p => {
                    newPerm[p] = true;
                  });
                  perm.deny.forEach(p => {
                    newPerm[p] = false;
                  });
                  kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
                }
                return
             }
              const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SERVER.ID).channels.cache.get(e.id))
              for await (const perm of channelPerm) {
                const bott = Distributors[0]
                const guild2 = bott.guilds.cache.get(sistem.SERVER.ID)
                let kanal = guild2.channels.cache.get(perm.id);
                let newPerm = {};
                perm.allow.forEach(p => {
                  newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                  newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
              }
              
              let Dists = Distributors.length;
              let countUser = length % Dists;
              Distributors.forEach((guard, _index) => {
                const members = data.members.splice(0, (_index == 0 ? sayı + countUser : sayı));
                if (members.length <= 0) return client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`, "log");
                guard.queryTasks.query(async () => {
                    return new Promise(async (resolve) => { 
                        for (let index = 0; index < members.length; index++) {
                            if(!newRole) {
                                client.logger.log(`[${role}] - ${bot.user.username} - Rol Silindi Dağıtım İptal`, "log");
                                break;
                            }
                            let uyeid = members[index];
                            let uye = guard.guilds.cache.get(global.sistem.SERVER.ID).members.cache.get(uyeid)
                            if (!uye || (uye && uye.roles.cache.has(newRole.id))) continue;
                            await uye.roles.add(newRole.id).catch(() => {
                                client.logger.log(`${uye.user.username} - Üyesine rol verilemedi.`, "log");
                            })
                        }
                        resolve();
                    })
                  })
                  function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                  }
                })


                const newData = new GUILD_ROLE_DATAS({
                    roleID: newRole.id,
                    name: newRole.name,
                    color: newRole.hexColor,
                    hoist: newRole.hoist,
                    position: newRole.position,
                    permissions: newRole.permissions.bitfield,
                    mentionable: newRole.mentionable,
                    time: Date.now(),
                    members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                    channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
                  });
                  newData.save();
            })
          }
          
        async processGuard(opt) {
            await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {
                "Process": {
                    date: Date.now(),
                    type: opt.type,
                    target: opt.target,
                    member: opt.member ? opt.member : undefined,
                }
            }}, {upsert: true});
        }

        async punitivesAdd(id, type) {
            let uye = client.guilds.cache.get(sistem.SERVER.ID).members.cache.get(id);
            if (!uye) return;
            if (type == "jail") { 
            if(uye.voice.channel) await uye.voice.disconnect().catch(err => {})
            return await uye.roles.cache.has(roller.boosterRolü) ? uye.roles.set([roller.boosterRolü, roller.şüpheliRolü]) : uye.roles.set([roller.şüpheliRolü]).catch(err => {}); 
            }
        
            if (type == "ban") return await uye.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(err => {}) 
        };
        
        async allPermissionClose() {
            const Roles = require('../Databases/Schemas/Guards/Guild.Protection.Roles.Backup');
            let sunucu = client.guilds.cache.get(sistem.SERVER.ID);
            if(!sunucu) return;
            
            const perms = [
        Discord.PermissionFlagsBits.Administrator,
        Discord.PermissionFlagsBits.ManageRoles,
        Discord.PermissionFlagsBits.ManageChannels,
        Discord.PermissionFlagsBits.ManageGuild,
        Discord.PermissionFlagsBits.ManageWebhooks
            ];
            let roller = sunucu.roles.cache.filter(rol => rol.manageable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
            roller.forEach(async (rol) => {
                await Roles.updateOne({Role: rol.id}, {$set: {"guildID": sunucu.id, Reason: "Guard Tarafından Devre-Dışı Kaldı!", "PermissionsBitFieldBitField": rol.permissions.bitfield }}, {upsert: true})
                await rol.setPermissionsBitFieldBitField(0n)
            });

            if(roller) {
                let Rows = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Rol İzinleri Aktif Et")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("proc_off")
                        .setEmoji("943285259733184592")

                )
                let kanal = sunucu.kanalBul("guard-log")
                const owner = await sunucu.fetchOwner();
                if(owner) owner.send({embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

\` ••❯ \`**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Yukarda bulunan rol(lerin) izinlerini tekrardan aktif etmek için, ${sunucu.name} sunucusunda bulunan \`#guard-log\` kanalında ki düğmeden aktif edebilirsin.`)]}).catch(err => {})

                if(kanal) kanal.send({content:`@everyone`, embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

\` ••❯ \`**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Aşağıda bulunan düğme ile tekrardan aktif edebilirsin. Bunun için sunucu sahibi veya bot sahibi olmalısın.`)], components: [Rows]}).then(async (msg) => {
                    let tacsahip = await sunucu.fetchOwner();
                    var filter = i =>  i.customId == "proc_off" && (ayarlar.staff.includes(i.user.id) || i.user.id === tacsahip.id)
                    let collector = msg.createMessageComponentCollector({ filter, max: 1 })
                    collector.on('collect', async (i) => {
                        let checkRoles = await Roles.find({})
                        if(checkRoles) checkRoles.filter(x => msg.guild.roles.cache.get(x.Role)).forEach(async (data) => {
                            let rolgetir = msg.guild.roles.cache.get(data.Role)
                            if(rolgetir) rolgetir.setPermissionsBitFieldBitField(data.PermissionsBitFieldBitField).catch(err => {});
                        })
                        Rows.components[0].setStyle(ButtonStyle.Success).setLabel("Başarıyla Rol İzinleri Aktif Edildi").setDisabled(true)
                        msg.edit({components: [Rows]})
                        i.reply({embeds: [new EmbedBuilder().setColor("Green").setDescription(`
Başarıyla ${sunucu.name} sunucusunun **${checkRoles ? checkRoles.length >= 1 ? checkRoles.length : 0 : 0}** rolünün izinleri tekrardan aktif edildi. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

${checkRoles.length >= 1 ? `\` ••❯ \` **İzinleri Tekrardan Açılan Rol(ler)**:\n`+ checkRoles.map(x => `\` • \` ${sunucu.roles.cache.get(x.Role)} (\`${x.Role}\`)`).join("\n") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}`)],

                        ephemeral: true})
                        await Roles.deleteMany({guildID: sunucu.id})
                    })
                })
            }
        }

        connect(token) {
            if(!token) {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
                process.exit()
                return;
            }
            this.login(token).then(cartel => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
                this.user.setPresence({ activities: [{name:sistem.botStatus.Name}], status:sistem.botStatus.Status })
                this.on("ready", async () => { 
                    this.Upstaffs = require('../Plugins/Staff/_index');
                    this._statSystem = global._statSystem = require('../../Global/Plugins/Staff/Sources/_settings');
                    await this.startDistributors()
                    let guild = client.guilds.cache.get(global.sistem.SERVER.ID);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return
                    }
                    if(guild) await guild.members.fetch().then(fetchedMembers=> { })
                    this.user.setPresence({
                        activities: [{ name: this.sistem.botStatus.Name , url: "https://www.twitch.tv/keasydesign", type: Discord.ActivityType.Streaming }],
                        status: "dnd"
                    });
                    const channel = client.channels.cache.get(this.system.botStatus.BOT_SES);
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                        selfDeaf: true
                    });
                                
                })
            }).catch(cartel => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
                setTimeout(() => {
                    this.login().catch(cartel => {
                        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                        process.exit()
                    })
                }, 5000 )
            })
        }
        
}

module.exports = { cartel }