const { Client, Collection, Constants, GatewayIntentBits, ActionRowBuilder, ButtonBuilder,ButtonStyle, EmbedBuilder, Options } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')

const sistem = global.sistem = require('../Settings/_system.json');
const { GUILD } = require('../../Global/Init/Settings');
const Discord = require("discord.js")
// SENKRON
const GUARD_SETTINGS = require('../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../Global/Databases/Schemas/Global.Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT
let TAC = []
const { bgBlue, black, green } = require("chalk");
class cartel extends Client {
    constructor(...options) {
        super({
            options,
            intents: Object.keys(GatewayIntentBits),

        });
        Object.defineProperty(this, "location", { value: process.cwd() });
        this.sistem = this.system = require('../Settings/_system.json');

        GUILD.fetch(this.sistem.SERVER.ID)
        this.users.getUser = GetUser;
        this.Upstaffs = {}
        this._statSystem = global._statSystem = {}
        this.getUser = GetUser;
        async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
        this.logger = require('../Functions/Logger');
        this.genEmbed = global.genEmbed = require('../Init/Embed');
        require('../Functions/Dates');
        require('../Functions/Numbers');
        require('../Prototypes/_sources');
        require('../Prototypes/_user');
        this.botName;
        this.commands = new Collection();
        this.aliases = new Collection();
        this.setMaxListeners(10000);

    }

    async fetchCommands(active = true, slash = false) {
        if (slash) {
            const slashcommands = await globPromise(`../../Server/${this.botName}/_slashcommands/*/*.js`);
            const arrSlash = [];
            slashcommands.map((value) => {
                const file = require(value);
                if (!file?.name) return;
                this.slashcommands.set(file.name, file);

                if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                arrSlash.push(file);

            });
            this.on("ready", async () => {
                let fetchGuild = await this.guilds.cache.get(global.sistem.SERVER.ID)
                if (fetchGuild) await fetchGuild.commands.set(arrSlash);
            })
        }
        if (!active) return;
        let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
        await GUILD.fetch(this.sistem.SERVER.ID)
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Server/${this.botName}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
            files.forEach(file => {
                let referans = require(`../../Server/${this.botName}/_commands/${dir}/${file}`);
                if (referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                this.commands.set(referans.Isim, referans);
                if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
            });
        });
    }

    async fetchEvents(active = true) {
        if (!active) return;
        let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`../../Server/${this.botName}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let referans = require(`../../Server/${this.botName}/_events/${dir}/${file}`);
                this.on(referans.config.Event, referans);
            });
        });
    }

    async checkMember(id, type, process = "İşlem Bulunamadı.") {
        let guild = this.guilds.cache.get(sistem.SERVER.ID)
        if (!guild) return false;
        let uye = guild.members.cache.get(id)
        if (!uye) return;
        let Whitelist = await GUARD_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
        let Sunucu = await GUILD_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
        if (!Sunucu) return false;
        if (!Whitelist) return false;
        let guildSettings = Sunucu.Ayarlar
        if (!guildSettings) return false;
        if (!Whitelist.guildProtection) return true;
        if (uye.id === this.user.id || uye.id === uye.guild.ownerId || Whitelist.unManageable.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.BOTS.some(g => uye.id === g || uye.roles.cache.has(g)) || guildSettings.staff.includes(uye.id)) return true;
        if (!type) return false;
        switch (type) {
            case "guild": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.guildAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
            case "emoji": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.emojiAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
            case "bot": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.botAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
            case "member": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.memberAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
            case "channels": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.channelsAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
            case "roles": {
                if (Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g)) || Whitelist.rolesAcess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)
                return false;
            }
        }
        return false;
    }

    async checkProcessLimit(uye, limit, zaman, process) {
        let id = uye.id
        let limitController = dataLimit.get(id) || []
        let type = { _id: id, proc: process, date: Date.now() }
        let Whitelist = await GUARD_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
        if (!Whitelist.limit) return true;
        limitController.push(type)
        dataLimit.set(id, limitController)
        setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
        if (limitController.length >= limit) {
            let loged = uye.guild.kanalBul("guard-log");
            let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index + 1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
            if (loged) loged.send(taslak);
            let taç = uye.guild.members.cache.get(uye.guild.ownerId)
            if (taç) taç.send(taslak).catch(err => { })
            return false
        } else {
            return true
        }
    }
    async processGuard(opt) {
        await GUARD_SETTINGS.updateOne({ guildID: sistem.SERVER.ID }, {
            $push: {
                "Process": {
                    date: Date.now(),
                    type: opt.type,
                    target: opt.target,
                    member: opt.member ? opt.member : undefined,
                }
            }
        }, { upsert: true });
    }
    async queryManage(oldData, newData) {
        const guildSettings = require('../Databases/Schemas/Global.Guild.Settings');
        let veriData = await guildSettings.findOne({ guildID: sistem.SERVER.ID })
        let sunucuData = veriData.Ayarlar
        if (sunucuData) {
            if (oldData === sunucuData.tagrol) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.tagrol": newData } })
            }
            if (oldData === sunucuData.muteRolü) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.muteRolü": newData } })
            }
            if (oldData === sunucuData.jailRolü) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.jailRolü": newData } })
            }
            if (oldData === sunucuData.şüpheliRolü) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.şüpheliRolü": newData } })
            }
            if (oldData === sunucuData.yasaklıtagrol) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.yasaklıtagrol": newData } })
            }
            if (oldData === sunucuData.vipRolü) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.vipRolü": newData } })
            }
            if (oldData === sunucuData.Katıldı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.Katıldı": newData } })
            }
            if (oldData === sunucuData.altilkyetki) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.altilkyetki": newData } })
            }
            if (oldData === sunucuData.etkinlikKatılımcısı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.etkinlikKatılımcısı": newData } })
            }
            if (oldData === sunucuData.cekilisKatılımcısı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.cekilisKatılımcısı": newData } })
            }
            if (oldData === sunucuData.TerfiLog) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.TerfiLog": newData } })
            }
            if (oldData === sunucuData.kurallarKanalı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.kurallarKanalı": newData } })
            }
            if (oldData === sunucuData.teyitkanali) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.teyitkanali": newData } })
            }
            if (oldData === sunucuData.chatKanalı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.chatKanalı": newData } })
            }
            if (oldData === sunucuData.toplantıKanalı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.toplantıKanalı": newData } })
            }
            if (oldData === sunucuData.invitelog) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.invitelog": newData } })
            }
            if (oldData === sunucuData.publicKategorisi) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.publicKategorisi": newData } })
            }
            if (oldData === sunucuData.registerKategorisi) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.registerKategorisi": newData } })
            }
            if (oldData === sunucuData.streamerKategorisi) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.streamerKategorisi": newData } })
            }
            if (oldData === sunucuData.photoChatKanalı) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.photoChatKanalı": newData } })
            }
            if (oldData === sunucuData.sleepRoom) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.sleepRoom": newData } })
            }
            if (oldData === sunucuData.başlangıçYetki) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "Ayarlar.başlangıçYetki": newData } })
            }
            if (sunucuData.man.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.man": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.man": newData } })
            }
            if (sunucuData.woman.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.woman": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.woman": newData } })
            }
            if (sunucuData.unregister.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.unregister": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.unregister": newData } })
            }
            if (sunucuData.Yetkiler.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.Yetkiler": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.Yetkiler": newData } })
            }
            if (sunucuData.teyitciRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.teyitciRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.teyitciRolleri": newData } })
            }
            if (sunucuData.kurucuRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.kurucuRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.kurucuRolleri": newData } })
            }
            if (sunucuData.ayrıkKanallar.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.ayrıkKanallar": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.ayrıkKanallar": newData } })
            }
            if (sunucuData.izinliKanallar.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.izinliKanallar": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.izinliKanallar": newData } })
            }
            if (sunucuData.rolPanelRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.rolPanelRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.rolPanelRolleri": newData } })
            }
            if (sunucuData.üstYönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.üstYönetimRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.üstYönetimRolleri": newData } })
            }
            if (sunucuData.altYönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.altYönetimRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.altYönetimRolleri": newData } })
            }
            if (sunucuData.yönetimRolleri.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.yönetimRolleri": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.yönetimRolleri": newData } })
            }

            if (sunucuData.banHammer.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.banHammer": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.banHammer": newData } })
            }
            if (sunucuData.jailHammer.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.jailHammer": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.jailHammer": newData } })
            }
            if (sunucuData.voiceMuteHammer.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.voiceMuteHammer": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.voiceMuteHammer": newData } })
            }
            if (sunucuData.muteHammer.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.muteHammer": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.muteHammer": newData } })
            }

            if (sunucuData.warnHammer.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.warnHammer": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.warnHammer": newData } })
            }
            if (sunucuData.coinChat.includes(oldData)) {
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $pull: { "Ayarlar.coinChat": oldData } })
                await guildSettings.updateOne({ guildID: sistem.SERVER.ID }, { $push: { "Ayarlar.coinChat": newData } })
            }
        }
    }

    async punitivesAdd(id, type) {
        let guild = client.guilds.cache.get(sistem.SERVER.ID)
        if (!guild) return;
        let uye = guild.members.cache.get(id)
        if (!uye) return;
        if (type == "jail") {
            if (uye.voice.channel) uye.voice.disconnect().catch(err => { })
            return uye.setRoles(roller.şüpheliRolü)
        }
        if (type == "ban") return uye.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(async (err) => {

        })
    };

    async allPermissionClose() {
        const Roles = require('../Databases/Schemas/Guards/Guild.Protection.Roles.Backup');
        let sunucu = client.guilds.cache.get(sistem.SERVER.ID);
        if (!sunucu) return;

        const perms = [
            Discord.PermissionFlagsBits.Administrator,
            Discord.PermissionFlagsBits.ManageRoles,
            Discord.PermissionFlagsBits.ManageChannels,
            Discord.PermissionFlagsBits.ManageGuild,
            Discord.PermissionFlagsBits.ManageWebhooks
                ];
        let roller = sunucu.roles.cache.filter(rol => rol.manageable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
        roller.forEach(async (rol) => {
            await Roles.updateOne({ Role: rol.id }, { $set: { "guildID": sunucu.id, Reason: "Guard Tarafından Devre-Dışı Kaldı!", "PermissionsBitField": rol.permissions.bitfield } }, { upsert: true })
            await rol.setPermissionsBitField(0n)
        });

        if (roller) {
            let Rows = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Rol İzinleri Aktif Et")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("proc_off")
                    .setEmoji("943285259733184592")

            )
            let kanal = sunucu.kanalBul("guard-log")
            const owner = await sunucu.fetchOwner();
            if (owner) owner.send({
                embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

\` ••❯ \`**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Yukarda bulunan rol(lerin) izinlerini tekrardan aktif etmek için, ${sunucu.name} sunucusunda bulunan \`#guard-log\` kanalında ki düğmeden aktif edebilirsin.`)]
            }).catch(err => { })

            if (kanal) kanal.send({
                content: `@everyone`, embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`**Merhaba!** ${sunucu.name}
Aşağı da listelenmekte olan rol(lerin) önemli izinleri başarıyla kapatıldı. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

\` ••❯ \`**İzinleri Kapatılan Rol(ler)**
${roller.size >= 1 ? roller.map(x => `\` • \` ${x} (\`${x.id}\`)`).join("\n ") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}

Aşağıda bulunan düğme ile tekrardan aktif edebilirsin. Bunun için sunucu sahibi veya bot sahibi olmalısın.`)], components: [Rows]
            }).then(async (msg) => {
                let tacsahip = await sunucu.fetchOwner();
                var filter = i => i.customId == "proc_off" && (ayarlar.staff.includes(i.user.id) || i.user.id === tacsahip.id)
                let collector = msg.createMessageComponentCollector({ filter, max: 1 })
                collector.on('collect', async (i) => {
                    let checkRoles = await Roles.find({})
                    if (checkRoles) checkRoles.filter(x => msg.guild.roles.cache.get(x.Role)).forEach(async (data) => {
                        let rolgetir = msg.guild.roles.cache.get(data.Role)
                        if (rolgetir) rolgetir.setPermissionsBitField(data.PermissionsBitField).catch(err => { });
                    })
                    Rows.components[0].setStyle(ButtonStyle.Success).setLabel("Başarıyla Rol İzinleri Aktif Edildi").setDisabled(true)
                    msg.edit({ components: [Rows] })
                    i.reply({
                        embeds: [new EmbedBuilder().setColor("Green").setDescription(`
Başarıyla ${sunucu.name} sunucusunun **${checkRoles ? checkRoles.length >= 1 ? checkRoles.length : 0 : 0}** rolünün izinleri tekrardan aktif edildi. ${sunucu.emojiGöster(emojiler.Onay) ? sunucu.emojiGöster(emojiler.Onay) : ":white_check_mark:"}

${checkRoles.length >= 1 ? `\` ••❯ \` **İzinleri Tekrardan Açılan Rol(ler)**:\n` + checkRoles.map(x => `\` • \` ${sunucu.roles.cache.get(x.Role)} (\`${x.Role}\`)`).join("\n") : `\` • \` İzinleri Kapatılan Rol Bulunamadı!`}`)],

                        ephemeral: true
                    })
                    await Roles.deleteMany({ guildID: sunucu.id })
                })
            })
        }
    }

    connect(token) {
        if (!token) {
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`, "error");
            process.exit()
            return;
        }
        this.login(token).then(cartel => {

            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`, "botReady")
            this.on("ready", async () => {
                let guild = client.guilds.cache.get(global.sistem.SERVER.ID);
                if (!guild) {
                    console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                    return process.exit();
                }
                this.Upstaffs = require('../Plugins/Staff/_index');
                this._statSystem = global._statSystem = require('../../Global/Plugins/Staff/Sources/_settings');
                client.user.setPresence({
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
                if (guild) await guild.members.fetch().then(fetchedMembers => { })
                let Whitelist = await GUARD_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
                if (!Whitelist) await GUARD_SETTINGS.updateOne({ guildID: sistem.SERVER.ID }, { $set: { "auditLimit": 10, auditInLimitTime: "2m" } }, { upsert: true })
            })
        })

        .catch(cartel => {
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`, "reconnecting")
            setTimeout(() => {
                this.login().catch(cartel => {
                    this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`, "error")
                    process.exit()
                })
            }, 5000)
        })
    }

}

module.exports = { cartel }