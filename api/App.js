const { genEmbed } = require('../v14BOTSS/Global/Init/Embed');
const express = require('express');
const BP = require('body-parser');
const path = require('path');
const url = require("url");
const cors = require("cors")
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const ms = require('ms')
const GUILD_SETTINGS = require('../v14BOTSS/Global/Databases/Schemas/Global.Guild.Settings')
const GUARD_SETTINGS = require('../v14BOTSS/Global/Databases/Schemas/Guards/Global.Guard.Settings')
const STAT = require('../v14BOTSS/Global/Databases/Schemas/Plugins/Client.Users.Stats');
const UPSTAFF = require('../v14BOTSS/Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const TASKS = require('../v14BOTSS/Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const PUNITIVES = require('../v14BOTSS/Global/Databases/Schemas/Global.Punitives');
const FORCEBAN = require('../v14BOTSS/Global/Databases/Schemas/Punitives.Forcebans');
const JAIL = require('../v14BOTSS/Global/Databases/Schemas/Punitives.Jails');
const { DC, VK, ETKINLIK, STREAM } = require('../v14BOTSS/Global/Databases/Schemas/Punitives.Activitys');
const MUTE = require('../v14BOTSS/Global/Databases/Schemas/Punitives.Mutes');
const VMUTE = require('../v14BOTSS/Global/Databases/Schemas/Punitives.Vmutes');
const Users = require('../v14BOTSS/Global/Databases/Schemas/Client.Users');
const WELCOME = require('../v14BOTSS/Global/Databases/Schemas/Others/Guild.Welcome.Settings');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
let _sys = require('../v14BOTSS/Global/Settings/_settings');
let http = require('http');
let https = require('https');
const fs = require('fs')
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
const Sorumluluk = require('../v14BOTSS/Global/Databases/Schemas/Plugins/Guild.Responsibility');
const PrivateCommand = require('../v14BOTSS/Global/Databases/Schemas/Plugins/Client.Guilds.Private.Commands');
const Shops = require('../v14BOTSS/Global/Databases/Schemas/Others/Economy.Shop.Items');
const Custom = require('../v14BOTSS/Global/Databases/Schemas/Others/Custom.List.Menu')
let secretKey = 'v8'
let pmlogs = []
const {MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js')
let children = require("child_process");
let ls = children.exec(`pm2 logs --raw`);

ls.stdout.on('data', async function (data) {
  pmlogs.push(data)
});

let state = "START"
let Bots = []
let Gecikmeler = [1, 5, 5, 5, 4, 5, 5, 6, 5]
let Zamanlayıcı = require("../v14BOTSS/Global/Plugins/Stats/Time.Manager");
const { web_info, info } = require('./client_config');
const { cartel } = require('./client');

async function statTemizleme(client, filter) {
  let guild = client.guilds.cache.get(sistem.SERVER.ID);
  if(!guild) return;
    Zamanlayıcı.setToday(guild.id);
    let safeMap = new Map()
    let stats = await STAT.find({ guildID: guild.id });
    stats.filter(s => !guild.members.cache.has(s.userID)).forEach(async (s) =>  await STAT.findByIdAndDelete(s._id));
    await STAT.updateMany({ guildID: guild.id }, { 
      voiceStats: safeMap,
      chatStats: safeMap,
      totalVoiceStats: 0,
      totalChatStats: 0,
      allVoice: {},
      allMessage: {},
      allCategory: {},
      lifeVoiceStats: new Map(),
      lifeChatStats: new Map(),
      lifeTotalChatStats: 0,
      lifeTotalVoiceStats: 0
    }, {multi: true});
    client.logger.log("Tüm istatistik verileri temizlendi.","stat")
}


/**
 * @param {number} port   
 * @param {cartel} client 
 */

class Websocket {
    constructor(port, client) {
        this.port = port
        this.client = client
        this.app = express();                
        this.app.use(cors());
        this.app.use(BP.urlencoded({ extended: false }));
        this.app.use(BP.json({ strict: true }));

        this.app.use(basicAuth({
          users: { "cartel": "12345678" },
          challenge: true,
        }));

        this.app.get('/', async (req, res) => {
          res.send('OK')
    
        })

        this.app.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          next();
        });



        this.app.post('/api/:secret/stats/reset', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send(`İnvalid Request!`), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await statTemizleme(client);
            res.send({status: "ok"});
        })
        this.app.post('/api/:secret/stats/purge', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send(`İnvalid Request!`), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await STAT.deleteMany({});
            res.send({status: "ok"});
        })
        this.app.post('/api/:secret/stats/delete', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send(`İnvalid Request!`), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            if(req.body.id) {
              await STAT.deleteMany({userID: req.body.id});
              res.send({status: "ok"})
            } else {
              res.send({status: "error"});
            }
        })
        this.app.post('/api/:secret/giveaways/start', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send({status: "error"}), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send({status: "error"});
            let channel = guild.channels.cache.get(req.body.id)
            if(!channel) return res.send({status: "error"});
            if(req.body.id) {
              let kazanansayi = req.body.winners || 1
              let odul = req.body.prize || "Ödül Bulunamadı!"
              let roles = req.body.roles || []
              let ses = req.body.voice || false 
              let sadecetag = req.body.tag || false
                client.giveawaysManager
                .start(channel, {
                    duration: ms(req.body.duration),
                    winnerCount: Number(kazanansayi),
                    messages: {
                      drawing: `Kalan Zaman: {timestamp}\n
**Çekiliş koşulları**: 
${ses ? `Seste bulunmak zorundasın!` : `Seste bulunmak zorunda değilsin!`}
${sadecetag ? `İsminde \`${ayarlar.tag}\` sembolü bulundurmak zorundasın!` : `İsminde \`${ayarlar.tag}\` sembolü bulundurmak zorunda değilsin!`}
${roles && roles.length > 0 ? `Üstünde ${roles.map(x => guild.roles.cache.get(x)).listRoles()} bulunmalı.` : `Herhangi bir rol ile katılabilirsin.`}    `
                    },
                    prize: `${odul}`,
                    lastChance: {
                      enabled: true,
                      content: '**KATILMAK İÇİN SON ŞANS !** ⚠️',
                      threshold: 5000,
                      embedColor: 'RED'
                  }
                }).then(x => {
                  client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
                    if (giveaway.messageId == x.messageId) { 
                      let channel = guild.channels.cache.get(giveaway.channelId)
                      if(channel && ses) winners.forEach((member) => {
                        let uye = guild.members.cache.get(member.user.id)
                        if(uye && uye.voice && uye.voice.channel) {
                          channel.send(`${member} kullanıcısı ${uye.voice.channel} Kanalında Seste Bulunuyor.`)   
                        } else {
                          channel.send(`${member} Kullanıcısı Bir Seste Bulunmuyor.`)   
                        }
                      });
                     
                    }
                  });
                  client.giveawaysManager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
                    let uye = guild.members.cache.get(member.user.id)
                    if (uye && giveaway.messageId == x.messageId) {
                      console.log(ses)
                        let text = ''
                        if(roles && roles.length > 0 && roles.some(x => !member.roles.cache.has(x))) {
                          reaction.users.remove(member.user);
                          text += `Bu çekilişte sadece üstünde "**${roles.map(x => guild.roles.cache.get(x).name).listRoles()}**" rolü(leri) bulunan kullanıcılar katılabilir. ${guild.emojiGöster(emojiler.Iptal)}\n`
                        }
                        if(sadecetag && !uye.user.username.includes(ayarlar.tag)) {
                          reaction.users.remove(member.user);
                          text += `Bu çekilişe sadece isminin başında \`${ayarlar.tag}\` sembolü olan kullanıcılar katılabilir. ${guild.emojiGöster(emojiler.Iptal)}\n`
                         
                        }
                        if(ses && uye.voice && !uye.voice.channel) {
                          reaction.users.remove(member.user);
                          text += `Bu çekilişe sadece seste olan kullanıcılar katılabilir. ${guild.emojiGöster(emojiler.Iptal)}`
                        }
                        if(text && text.length > 10) member.send(`**Çekiliş koşulları karışlanamadı**:
${text}`).catch(err => {})
                    }
                  });
                })
              
            } else {
              return res.send({status: "error"});
            }
        })
     
        this.app.post('/api/:secret/shop/add', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send(`İnvalid Request!`), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await Shops.updateOne({name: req.body.name}, {
              desc: req.body.desc ? req.body.desc : "Açıklama Bulunamadı!",
              emoji: req.body.emoji ? req.body.emoji : "",
              gold: req.body.gold ? Number(req.body.gold) : 0,
              coin: req.body.coin ? Number(req.body.coin) : 0,
              role: req.body.role ? true : false,
              roleID: req.body.role ? req.body.role : undefined,
            }, {upsert: true})
            res.send("OK");
        })
        this.app.post('/api/:secret/shop/delete', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            if(!req.body) return res.send(`İnvalid Request!`), res.end();
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await Shops.deleteOne({name: req.body.name})
            res.send("OK");
        })
        this.app.post('/api/:secret/punitives/purge', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await PUNITIVES.deleteMany();
            await MUTE.deleteMany();
            await VMUTE.deleteMany();
            await JAIL.deleteMany();
            await FORCEBAN.deleteMany();
            await DC.deleteMany();
            await VK.deleteMany();
            await ETKINLIK.deleteMany();
            await STREAM.deleteMany();
            res.send({status: "ok"});
        })
        this.app.post('/api/:secret/selectmenu/create', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            let secretKodu = secretOluştur(10)
            await Custom.updateOne({Name: req.body.name}, { $set: { 
              "Text": req.body.desc, 
              "Roles": req.body.roles, 
              "Date": Date.now(), 
              "Access": req.body.access,
              Secret: secretKodu, 
              "Author": client.user.id,  
            }}, {upsert: true})
            let channel = guild.channels.cache.get(req.body.channel)
            if(channel) {
              let kurulcak = await Custom.findOne({Name: req.body.name})
              if(kurulcak) {
                  let Opt = []
                  kurulcak.Roles.forEach(r => {
                    let rol = guild.roles.cache.get(r)
                    if(rol) {
                      Opt.push({
                        label: rol.name,
                        description: `${rol.name} rolüne sahip olmak için tıkla`,
                        emoji: { "id": "943285259733184592"},
                        value: r
                      })
                    }
                  })
                  let listMenu = new MessageActionRow().addComponents(
                      new MessageSelectMenu()
                      .setCustomId(kurulcak.Secret)
                      .setPlaceholder(`${kurulcak.Name}`)
                      .setOptions(
                          [Opt, {"label": "Rol İstemiyorum", "value": "rolsil", "emoji": { "id": "922058306263072860", "name": "monarch_trash" }}]
                      )
                  )

     
                      Bots.map(botClient => {
                        if(botClient.token == sistem.TOKENS.SECURITY.MAIN) {
                          let guildcik = botClient.guilds.cache.get(sistem.SERVER.ID)
                          if(guildcik) {
                            channel = guildcik.channels.cache.get(req.body.channel)
                            if(channel) {
                              channel.send({content: `${kurulcak.Text}`, components: [listMenu]})
                            } 
                          }
                        }
                      })
                  
              
                 
         
              }
            }
            res.send({status: "ok", secret: secretKodu});
        })
        this.app.post('/api/:secret/selectmenu/delete', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            await Custom.deleteOne({Secret: req.body.secret})
            res.send({status: "ok"});
        })
        function secretOluştur(length) {
          var result           = '';
          var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          var charactersLength = characters.length;
          for ( var i = 0; i < length; i++ ) {
             result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
       }
        this.app.post('/api/:secret/welcome/set', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            let type = req.body.type
            let webhook = req.body.webhook
            if(type == "SET") {
              let data = await WELCOME.findOne({guildId: guild.id})
              await WELCOME.updateOne({guildId: guild.id}, {$set: {
                "Text": req.body.text,
                "Webhook": webhook == true ? webhook : webhook == false ? webhook : data ? data.Webhook : false,
              }}, {upsert: true})
            }
            if(type == "DEFAULT") {
              await WELCOME.deleteOne({guildId: guild.id})
            }
            res.send({status: "OK"})
        })
        this.app.get('/api/:secret/welcome', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            let data = await WELCOME.findOne({guildId: guild.id})
            if(data) {
              res.send({status: "OK", text: data.Text, webhook: data.Webhook})
            } else {
              res.send({status: "OK", text: "Default"})
            }

        })
        this.app.get('/api/:secret/punitives', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            let _data = await PUNITIVES.find({})
            if(!_data) return res.send({status: "error"});
            let arr = []
            _data.map(x => {
              arr.push(x)
            })
            res.send(JSON.stringify(arr))
        })
        this.app.get('/api/:secret/stats', async (req, res) => {
          if(req.params.secret != secretKey) return res.send("401");
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) return res.send("Sunucu Bulunamadı!");
            let _data = await STAT.find({guildID: guild.id})
            if(!_data) return res.send({status: "error"});
            let arr = []
            _data.sort((a, b) => Number(b.lifeTotalVoiceStat) - Number(a.lifeTotalVoiceStats)).map(x => {
              arr.push(x)
            })
            res.send(JSON.stringify(arr))
        })

      this.app.post('/api/:secret/sendhook', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();

          let channel = client.channels.cache.get(req.body.channelId)
          if(!channel) return req.send(JSON.stringify({
            status: "ERROR",
            message: "Invalid Channel!"
          }))
          
          channel.APIhookSend(req.body.text, {
            avatarURI: req.body.avatar ? req.body.avatar : undefined,
            name: req.body.name ? req.body.name : undefined,
            embed: req.body.embed ? req.body.embed : undefined,
            channel_name: channel.name,

          })

          res.send(JSON.stringify({
            status: "OK",
            message: "Delivered!"
          }))
      })

      this.app.post('/api/:secret/pull', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let senk = await GUILD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
          ayarlar = senk.Ayarlar 
          let find = senk.Ayarlar[req.body.name].find(x => x.id == req.body.id || x.rol == req.body.id)
          if(!find) console.log({
            status: "ERROR",
            body: req.body
          })
          if(find) await GUILD_SETTINGS.updateOne({guildID: global.sistem.SERVER.ID}, {$pull: {[`Ayarlar.${req.body.name}`]: find}}, {upsert: true}), console.log({
            status: "OK",
            body: req.body
          })

      })
      this.app.get('/api/:secret/powerStatus', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        let os = require('os');
        function formatSizeUnits(bytes){
          if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2); }
          else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2); }
          else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2); }
          else if (bytes > 1)           { bytes = bytes; }
          else if (bytes == 1)          { bytes = bytes; }
          else                          { bytes = "0 bytes"; }
          return bytes;
        }
        let ms = Number(client.ws.ping / 10).toFixed(0)
        if(!Gecikmeler.slice(-2).includes(ms)) Gecikmeler.push(ms)
        state = state;
        res.write(JSON.stringify({
          message: "OK",
          status: state,
          bit: os.arch(),
          free_ram: formatSizeUnits(os.freemem()),
          ram: formatSizeUnits(os.totalmem()),
          used_ram: formatSizeUnits(os.totalmem() - os.freemem()),
          type: os.type().replace("Windows_NT", "Windows"),
          platform: os.platform(),
          hostname: os.hostname(),
          api_uptime: (client.uptime / 1000).toFixed(0),
          api_ping: ms,
          uptime: os.uptime(),
          last_uptime: Gecikmeler.filter(x => x >= 1),
          cpu: os.cpus()[0].model,
          thread: os.cpus().length || 0,
        }))
        res.end()
      })

      this.app.post('/api/:secret/emojis', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          const adapter = new FileSync("../v14BOTSS/Global/Settings/_emojis.json")
          const db = low(adapter)
          if(req.body.value) {
            db.set(`${req.body.name}`, `${req.body.value}`).write();
          } 
          console.log(req.body)
          res.send(db.value())
      })

      this.app.post('/api/:secret/package', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          const adapter = new FileSync("../v14BOTSS/Global/Settings/_system.json")
          const db = low(adapter)
          if(req.body.type == "START") {
            db.set("PACKAGE.StartAt", Date.now()).write();
          }
          
          if(req.body.type == "NO-PAYMENT") {
            db.set("PACKAGE.Status", false).write();
            let ls = children.exec(`pm2 stop 1 2 3 4 5 7 0`);
            state = "NO-PAYMENT"
            ls.stdout.on('data', async function (data) {
            });
          }

          if(req.body.type == "PAYMENT") {
            db.set("PACKAGE.LastPayment", Date.now()).write();
            db.set("PACKAGE.Status", true).write();
            db.get("PACKAGE.Payments").push({
                Id: req.body.id,
                Price: Number(req.body.price),
                Type: req.body.Type,
                Date: Date.now(),
                Payment: req.body.payment
            }).write();
            if(state == "NO-PAYMENT") {
              let ls = children.exec(`pm2 start 1 2 3 4 5 7 0`);
              ls.stdout.on('data', async function (data) {
                state = "START"
              });
            }
          }
          res.send(db.get("PACKAGE").value())
      })

      this.app.post('/api/:secret/power', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let ls;
          if(state == "NO-PAYMENT") return;
          if(req.body.type == "RESTART") {
            ls = children.exec(`pm2 restart 1 2 3 4 5 7 0`);
            ls.stdout.on('data', async function (data) {
              state = "START"
            });
            res.write(JSON.stringify({
              message: "OK",
              status: "RESTART",
            }))
          } 
          if(req.body.type == "START") {
            ls = children.exec(`pm2 start 1 2 3 4 5 7 0`);
            ls.stdout.on('data', async function (data) {
              state = "START"
            });
            res.write(JSON.stringify({
              message: "OK",
              status: "START",
            }))
          } 
          if(req.body.type == "STOP") {
            ls = children.exec(`pm2 stop 1 2 3 4 5 7 0`);
            ls.stdout.on('data', async function (data) {
              state = "STOP"
            });
            res.write(JSON.stringify({
              message: "OK",
              status: "STOP",
            }))
          } 
      })
      this.app.post('/api/:secret/push', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          console.log({
            status: "OK",
            body: req.body
          })
          let senk = await GUILD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
          ayarlar = senk.Ayarlar
          let obj = { id: req.body.id, isim: req.body.isim}
          if(req.body.name == "_staffs") {
           if(ayarlar._staffs.find(x => x.rol == req.body.rol)) return;
            let numara = ayarlar["_staffs"].length
            obj = {rol: req.body.rol, exrol: req.body.exrol || [], Puan: req.body.puan, No: numara > 0 ? numara++ : 0}
          }
          await GUILD_SETTINGS.updateOne({guildID: global.sistem.SERVER.ID}, {$push: {[`Ayarlar.${req.body.name}`]: obj}}, {upsert: true})
      })

      this.app.post('/api/:secret/post', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          console.log({
            status: "OK",
            body: req.body
          })
          let senk = await GUILD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
          ayarlar = senk.Ayarlar 
          await GUILD_SETTINGS.updateOne({guildID: global.sistem.SERVER.ID}, {$set: {[`Ayarlar.${req.body.name}`]: req.body.var}}, {upsert: true})
      })
      
      this.app.post('/api/:secret/guard', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          console.log({
            status: "OK",
            body: req.body
          })
          await GUARD_SETTINGS.updateOne({guildID: global.sistem.SERVER.ID}, {$set: {[`${req.body.name}`]: req.body.var}}, {upsert: true});      
      })

      this.app.post('/api/:secret/emojis/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let emoji = guild.emojis.cache.get(req.body.id)
          if(!emoji) return res.send("error");
          emoji.delete()
          .then(err => { res.send("ok") })
          .catch(err => { res.send("error") })
      
      })


      this.app.post('/api/:secret/privatecommands/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          if(req.body.name) await PrivateCommand.deleteOne({name: req.body.name})
          res.send("OK")
      
      })
      this.app.post('/api/:secret/privatecommands/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          await PrivateCommand.updateOne({name: req.body.name}, {
            $set: { 
              type: req.body.type,
              prefix: req.body.prefix,
              content: req.body.content
              .replace("ButtonBuilder","MessageButton")
              .replace("Secondary", "SECONDARY")
              .replace("Success", "SUCCESS")
              .replace("Danger","DANGER")
              .replace("Primary", "PRIMARY")
              .replace("ModalBuilder()", "Modal()")
              .replace("EmbedBuilder", "MessageEmbed")
  
              .replace("AttachmentBuilder", "MessageAttachment")
              .replace("ActionRowBuilder","MessageActionRow")
              .replace("SelectMenuBuilder","MessageSelectMenu")
              .replace("TextInputBuilder", "TextInputComponent"),
              allowed: req.body.access,
              created: client.user.id, 
            }
          }, {upsert: true});
          res.send("OK");
      
      })


      // Alt Komut


      this.app.post('/api/:secret/commands/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let check =  await GUILD_SETTINGS.findOne({guildID: guild.id})
          if(!check) return res.send("500")
          let cmd = check.talentPerms.find(acar => acar.Commands == req.body.name)
          if(cmd) await GUILD_SETTINGS.updateOne({guildID: guild.id}, { $pull: { "talentPerms": cmd } }, { upsert: true })
          res.send("OK");
      
      })
      this.app.post('/api/:secret/commands/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let check =  await GUILD_SETTINGS.findOne({guildID: guild.id})
          if(!check) return res.send("500")
          let cmd = check.talentPerms.find(acar => acar.Commands == req.body.name)
          if(cmd) return res.send("OWN");
          await GUILD_SETTINGS.updateOne({guildID: guild.id}, { $push: {"talentPerms": {
            Name: başHarfBüyült(req.body.name),
            Commands: req.body.name,
            Permission: req.body.permissions,
            Roles: req.body.roles,
            Date: Date.now(),
            Author: client.user.id,
          }}}, {upsert: true})
          res.send("OK");
      
      })
            
      this.app.post('/api/:secret/backup/set', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")

          let _yüklenecekveriler = req.body.json
          if(!_yüklenecekveriler) return res.send("ERR");
            _yüklenecekveriler.Date = Date.now()
            await GUILD_SETTINGS.updateOne({_id: "1"}, {$set: _yüklenecekveriler}, {upsert: true})
  
          res.send("OK");
      
      })

      this.app.post('/api/:secret/format/set', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          if(req.body.type == "SETUP") {
            await GUILD_SETTINGS.deleteOne({_id: "1"});
            await GUILD_SETTINGS.updateOne({_id: "1", guildID: guild.id}, {$set: {"Date": Date.now()}}, {upsert: true})
            res.send("OK");
          } 
          if(req.body.type == "STAFF") {
            await GUILD_SETTINGS.updateOne({_id: "1", guildID: guild.id}, {$set: { "Ayarlar._staffs": []}}, {upsert: true})
            res.send("OK");
          } 
      
      })

      function başHarfBüyült(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
      this.app.post('/api/:secret/staffs/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        if(!req.body) return res.send(`İnvalid Request!`), res.end();
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(!guild) return res.send("500")
        if(!req.body.id) return res.send("500");
        let uye = guild.members.cache.get(req.body.id)
        if(!uye) return res.send("NO");
        if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return res.send("KAYITSIZ")
        if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7) return res.send("YENI")
        if(ayarlar.type && !uye.user.username.includes(ayarlar.tag)) return res.send("TAG")
        if((ayarlar && ayarlar.yetkiliYasaklıTag) && ayarlar.yetkiliYasaklıTag.filter(x => x != ayarlar.tag).some(x => uye.user.username.includes(x))) return res.send("YASAKLI")
        let yetkiliRol = uye.guild.roles.cache.get(roller.altilkyetki);
        let uyeUstRol = uye.guild.roles.cache.get(uye.roles.highest.id)
        if(yetkiliRol.rawPosition < uyeUstRol.rawPosition) return res.send("YETKILI")
        let kontrol = await Users.findOne({_id: uye.id})
        if(kontrol && kontrol.Staff) return res.send("YETKILI")
        await Users.updateOne({ _id: uye.id }, { $set: { "Staff": true, "StaffGiveAdmin": uye.id} }, { upsert: true })
        let yetkiliLog = guild.kanalBul("yetki-ver-log")
        if(yetkiliLog) yetkiliLog.send({embeds: [new genEmbed().setDescription(`${uye} isimli üye \`${tarihsel(Date.now())}\` tarihinde **Web panel** tarafından yetkili olarak başlatıldı.`)]}) 
        await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
          Date: Date.now(),
          Process: "BAŞLATILMA - WEB",
          Role: roller.başlangıçYetki,
          Author: uye.id
        }}}, { upsert: true })
        uye.setNickname(uye.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})      
        return uye.roles.add(roller.başlangıçYetki).then(x => {
            uye.roles.add(roller.altilkyetki)
             client.Upstaffs.addPoint(uye.id,"1", "Bonus")
        }),res.send("OK");
        
      })
      this.app.post('/api/:secret/staffs/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        if(!req.body) return res.send(`İnvalid Request!`), res.end();
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(!guild) return res.send("500")
        if(!req.body.id) return res.send("500");
        let uye = guild.members.cache.get(req.body.id)
        if(!uye) return res.send("500");
        let kontrol = await Users.findOne({_id: uye.id}) || { Staff: false }
        if(kontrol && kontrol.Staff) uye.removeStaff(uye.roles.cache, true)
        await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
          Date: Date.now(),
          Process: "ÇEKİLDİ - WEB",
          Role: uye.roles.hoist ? uye.roles.hoist.id : roller.başlangıçYetki,
          Author: uye.id
        }}}, { upsert: true }) 
        let altYetki = guild.roles.cache.get(roller.altilkyetki)
        if(altYetki) await uye.roles.remove(uye.roles.cache.filter(rol => altYetki.position <= rol.position))
        let yetkiliLog = guild.kanalBul("yetki-çek-log")
        if(yetkiliLog) yetkiliLog.send({embeds: [new genEmbed().setDescription(`Web panel üzerinden ${uye.toString()} isimli üyenin \`${tarihsel(Date.now())}\` tarihinde yetkisini aldı!`)]})
        res.send("OK");
        
      })
      this.app.post('/api/:secret/emojis/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
            guild.emojis.create(req.body.url, req.body.name)
          .then(emoji => {
            if(!req.body.roles) res.send("OK")
            if(req.body.roles) {
                emoji.edit({
                  roles: req.body.roles,
                })
              res.send("OK")
            }
          })
          .catch(err => {
            res.send("ERR")
          });
      })
      this.app.post('/api/:secret/resp/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401")
        if(!req.body) return res.send(`İnvalid Request!`), res.end();
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(!guild) return res.send("500");
        await Sorumluluk.updateOne({name: req.body.name}, {
          $set: {
            name: req.body.name ,
            role: req.body.role,
            leaders: req.body.leaders ? req.body.leaders : [],
            date: Date.now(),
            created: client.user.id,
          }
          }, {upsert: true})
          res.send("OK")
      })
      this.app.post('/api/:secret/resp/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401")
        if(!req.body) return res.send(`İnvalid Request!`), res.end();
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(!guild) return res.send("500");
        await Sorumluluk.deleteOne({name: req.body.name})
        res.send("OK")
      })
      this.app.post('/api/:secret/tasks/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let rol = guild.roles.cache.get(req.body.id)
          if(rol) {
            let bilgi = {
              genelses: req.body.genelses || 0,
              publicses: req.body.publicses || 0,
              taglı: req.body.taglı || 0,
              yetkili: req.body.yetkili || 0,
              davet: req.body.davet || 0,
              register: req.body.register || 0,
              sorumluluk: req.body.sorumluluk || 0,
              rol: req.body.id,
              ödül: req.body.ödül || 10,
              süre: req.body.süre ? req.body.süre : "unlimited"
            }
            let verilenGörev = 0;
            if(bilgi && bilgi.genelses > 0) verilenGörev++
            if(bilgi && bilgi.publicses > 0) verilenGörev++
            if(bilgi && bilgi.taglı > 0) verilenGörev++
            if(bilgi && bilgi.yetkili > 0) verilenGörev++
            if(bilgi && bilgi.davet > 0) verilenGörev++
            if(bilgi && bilgi.register > 0) verilenGörev++
            if(bilgi && bilgi.sorumluluk > 0) verilenGörev++
            let görevData = await TASKS.findOne({Active: true, roleID: rol.id})
            if(görevData) {
              await TASKS.deleteOne({Active: true, roleID: rol.id})
            }
            let görevPush;
            if(bilgi.süre == "unlimited") görevPush = { 
              Active: true,
              AllVoice: bilgi.genelses,
              publicVoice: bilgi.publicses,
              Tagged: bilgi.taglı,
              Staff: bilgi.yetkili,
              Sorumluluk: bilgi.sorumluluk,
              Register: bilgi.register,
              Invite: bilgi.davet,
              Reward: bilgi.ödül,
              countTasks: Number(verilenGörev) 
            }
            if(bilgi.süre != "unlimited") görevPush = { 
              Active: true, 
              AllVoice: bilgi.genelses, 
              publicVoice: bilgi.publicses, 
              Tagged: bilgi.taglı, 
              Staff: bilgi.yetkili, 
              Register: bilgi.register, 
              Sorumluluk: bilgi.sorumluluk,
              Invite: bilgi.davet, 
              Reward: bilgi.ödül, 
              Time: Date.now()+ms(String(bilgi.süre)), 
              countTasks: Number(verilenGörev) 
            
            }
            let amcıklar = []
            let verilcekÜyeler = rol.members
            rol.members.forEach(async (orospuevladı) => {
              amcıklar.push(orospuevladı.id)
              await STAT.updateOne({guildID: sistem.SERVER.ID, userID: orospuevladı.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
              await Users.updateOne({_id: orospuevladı.id}, {$set: { "Staff": true }}, { upsert:true })

              await UPSTAFF.updateOne({_id: orospuevladı.id}, { $set: {"Mission": {
                Tagged: 0,
                Register: 0,
                Invite: 0,
                Staff: 0,
                Sorumluluk: 0,
                CompletedSorumluluk: false,
                completedMission: 0,
                CompletedStaff: false,
                CompletedInvite: false,
                CompletedAllVoice: false,
                CompletedPublicVoice: false,
                CompletedTagged: false,
                CompletedRegister: false,
              }, "Yönetim": true }})
            })
            
            await TASKS.updateOne({roleID: rol.id}, {$set: görevPush, $push: {Users: amcıklar}}, {upsert: true})
            let görevBilgilendirme = guild.kanalBul("görev-bilgi")
            if(görevBilgilendirme) görevBilgilendirme.send({content: `${rol}`, embeds: [new genEmbed().setFooter(`${sistem.botSettings.Prefixs[0]}görev komutu ile verilen görevlerinizi listeleyebilirsiniz.`).setTitle(`${guild.emojiGöster(emojiler.sarıYıldız)} Bir Görev Daha Eklendi!`).setDescription(`${guild.emojiGöster(emojiler.Görev.Kek)} ${rol} rolünde bulunan ${verilcekÜyeler.map(x => x).slice(0,2).join(", ")} ${verilcekÜyeler.size > 2 ? `ve ${verilcekÜyeler.size - 2} daha fazlası...` : ''} üyeye(üyelerine) **${verilenGörev} adet** görev taktim edildi.`)]})
            verilcekÜyeler.forEach(sünnetsizibneler => {
              sünnetsizibneler.send({embeds: [new genEmbed().setFooter(`${sistem.botSettings.Prefixs[0]}görev komutu ile verilen görevlerinizi listeleyebilirsiniz.`).setDescription(`${guild.emojiGöster(emojiler.sarıYıldız)} ${sünnetsizibneler} sana bir görev verildi görev bilgilerini öğrenmek için lütfen **${sistem.botSettings.Prefixs[0]}yetkim** komutundan detaylı bakabilirsin.`)]}).catch(err => {
              })
            })
            res.send("OK");
            res.end();
          } else {
            res.send("ERROR");
            res.end();
          }

        })
      this.app.post('/api/:secret/tasks/delete', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let role = guild.roles.cache.get(req.body.id)
          if(role) {
            role.members.forEach(async (uye) => {
              await UPSTAFF.updateOne({_id: uye.id}, {$set: {"Mission": {
                Tagged: 0,
                Register: 0,
                Invite: 0,
                Sorumluluk: 0,
                CompletedSorumluluk: false,
                Staff: 0,
                completedMission: 0,
                CompletedStaff: false,
                CompletedInvite: false,
                CompletedAllVoice: false,
                CompletedPublicVoice: false,
                CompletedTagged: false,
                CompletedRegister: false,
              }}}, {upsert: true})
              await STAT.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
            })
            let logKanal = guild.kanalBul("görev-log")
            if(logKanal) logKanal.send({embeds: [new genEmbed().setDescription(`${role} rolününe ait olan ${role.members.map(x => x).slice(0,2).join(", ")} ${role.members.size > 2 ? `ve ${role.members.size - 2} daha fazlası...` : ''} üyeler(üyelerin) <t:${String(Date.now()).slice(0, 10)}:R> web panel tarafından tüm görev bilgileri temizlendi.`)]})  
            res.send("OK")
            res.end();
            await TASKS.deleteOne({roleID: role.id})
          } else {
            await TASKS.deleteOne({roleID: req.body.id})
            res.send("OK");
            res.end();
          }

        })
      

      this.app.post('/api/:secret/users', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("Sunucu Bulunamadı!");
          let user = guild.members.cache.get(req.body.id)
          if(!user) return res.send("Kullanıcı Bulunamadı!");
          let type = req.body.type
          if(!type) return res.send("İşlem Belirlenmedi!")
          if(type == "BAN") {
                        user.send(`Merhaba ${user.user.username}!
Web panel üzerinden ${tarihsel(Date.now())} tarihinde sunucudan yasaklandınız.`).catch(err => {})
            guild.members.ban(user,{days: 7, reason: req.body.reason ? req.body.reason : "Synl.io Panel Tarafından Yasaklandı!"}).then(x => {
              res.send(`OK`);
            }).catch(err => {
              res.send("ERROR")
            });;
          }
          if(type == "KICK") {
            user.send(`Merhaba ${user.user.username}!
Web panel üzerinden ${tarihsel(Date.now())} tarihinde sunucudan atıldınız.`).catch(err => {})
            guild.members.kick(user, req.body.reason ? req.body.reason : "Synl.io Panel Tarafından Yasaklandı!").then(x => {
              res.send(`OK`);
            }).catch(err => {
              res.send("ERROR")
            });
          }
          if(type == "TIMEOUT") {
            let atılma = req.body.min ? req.body.min : 5
            let zaman = atılma * 60 * 1000
            user.timeout(req.body.min ? Number(zaman) : null, req.body.reason ? req.body.reason : "Synl.io Panel Tarafından Yasaklandı!");
            res.send("OK")
          }
          if(type == "ROLE") {
            let role = guild.roles.cache.get(req.body.value)
            if(!role) return res.send("ERROR");
            if(user.roles.cache.has(role.id)) {
              user.roles.remove(role.id).then(x => {
                user.send(`Merhaba ${user.user.username}!
Web panel üzerinden ${tarihsel(Date.now())} tarihinde \`@${role.name}\` rolü alındı.`).catch(err => {})
                res.send(`ROL ALINDI!`);
              })
            } else {
              user.roles.add(role.id).then(x => {
                user.send(`Merhaba ${user.user.username}!
Web panel üzerinden size ${tarihsel(Date.now())} tarihinde \`@${role.name}\` rolü verildi.`).catch(err => {})
                res.send(`ROL VERİLDİ!`);
              })
            }
          }
          if(type == "NICKNAME") {
            user.setNickname(req.body.value ? req.body.value : null ).then(x => {
                          user.send(`Merhaba ${user.user.username}!
Web panel üzerinden ${tarihsel(Date.now())} tarihinde ${req.body.value ? "isminiz " + req.body.value + " olarak değiştirildi." : "isminiz sıfırlandı."}`).catch(err => {})
              res.send(`İSİM DEĞİŞTİ!`)
            })
          }

      })
      this.app.post('/api/:secret/add', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          let oluşturulan;
          console.log(req.body)
          if(req.body.type == "ROLE") {
            oluşturulan = guild.roles.create({
              name: req.body.name ? req.body.name : "yeni rol",
              color: req.body.color ? req.body.color : 0,
              icon: req.body.icon ? req.body.icon : null,
              hoist: req.body.hoist ? req.body.hoist : false,
              mentionable: req.body.mentionable ? req.body.mentionable : false,
            })
          }
          if(req.body.type == "CHANNEL") {
            oluşturulan = guild.channels.create( req.body.name ? req.body.name : "yeni kanal",{
              type: req.body.channel_type ? req.body.channel_type : "GUILD_TEXT",
              parent: req.body.parent ? req.body.parent : undefined,
              position: req.body.position ? req.body.position : undefined,
              userLimit: req.body.userLimit ? req.body.userLimit : undefined,
            })
          }

        if(oluşturulan) res.send(JSON.stringify({"message": oluşturulan, "status": "OK"}))
        if(!oluşturulan) res.send(JSON.stringify({"message": "Oluşturulamadı!", "status": "ERROR"}))
      })
      this.app.post('/api/:secret/edit', async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
          if(!req.body) return res.send(`İnvalid Request!`), res.end();
          let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
          if(!guild) return res.send("500")
          console.log(req.body)
          if(req.body.type == "CHANNEL") {
            let role = guild.channels.cache.get(req.body.id);
            if(!role) return res.send(JSON.stringify({"message": "INVALID CHANNEL!"}))
            if(req.body.deleted) {
              return role.delete().then(x => {
                 res.send("SİLİNDİ!")
               }).catch(err => {
                 res.send("SİLİNEMEDİ!")
               })
             }
              if(role.type == "GUILD_TEXT") {
                role.edit({
                  parent: req.body.parent ? req.body.parent : role.parentId,
                  name: req.body.name ? req.body.name : role.name,
                  position: req.body.position ? req.body.position : role.rawPosition,
                }).then(r => {
                  res.send(JSON.stringify({"status":  "OK", "message": r}));
                  res.end();
                }).catch(err => {
                  res.send(JSON.stringify({"message": err, "status": "ERROR"}));
                  res.end();
                }) 
              } else if(role.type == "GUILD_VOICE") {
                role.edit({
                  parent: req.body.parent ? req.body.parent : role.parentId,
                  name: req.body.name ? req.body.name : role.name,
                  position: req.body.position ? req.body.position : role.rawPosition,
                  userLimit: req.body.userLimit ? req.body.userLimit : role.userLimit
                }).then(r => {
                  res.send(JSON.stringify({"status":  "OK", "message": r}));
                  res.end();
                }).catch(err => {
                  res.send(JSON.stringify({"message": err, "status": "ERROR"}));
                  res.end();
                }) 
              } else if (role.type == "GUILD_CATEGORY") {
                role.edit({
                  name: req.body.name ? req.body.name : role.name,
                  position: req.body.position ? req.body.position : role.rawPosition,
                }).then(r => {
                  res.send(JSON.stringify({"status":  "OK", "message": r}));
                  res.end();
                }).catch(err => {
                  res.send(JSON.stringify({"message": err, "status": "ERROR"}));
                  res.end();
                }) 
              }
          }

          if(req.body.type == "ROLE") {
            let role = guild.roles.cache.get(req.body.id);
            if(!role) return res.send(JSON.stringify({"message": "INVALID ROLE!"}))
            if(req.body.deleted) {
              return role.delete().then(x => {
                 res.send("SİLİNDİ!")
               }).catch(err => {
                 res.send("SİLİNEMEDİ!")
               })
             }
            role.edit({
              icon: req.body.icon ? req.body.icon : role.icon,
              name: req.body.name ? req.body.name : role.name,
              position: req.body.position ? req.body.position : role.rawPosition,
              color: req.body.color ? req.body.color : role.color,
              hoist: req.body.hoist ? req.body.hoist : req.body.hoist == false ? req.body.hoist : role.hoist,
              mentionable: req.body.mentionable == true ? req.body.mentionable : req.body.mentionable == false ? req.body.mentionable :  role.mentionable,
            }).then(r => {
              res.send(JSON.stringify({"status":  "OK", "message": r}));
              res.end();
            }).catch(err => {
              res.send(JSON.stringify({"message": err, "status": "ERROR"}));
              res.end();
            }) 
          }


          if(req.body.type == "GUILD") {
            if(req.body.name != guild.name) {
              guild.setName(req.body.name)
            }
            if(req.body.iconURL) {
              guild.setIcon(req.body.iconURL)
            }
            if(req.body.bannerURL) {
              guild.setBanner(req.body.bannerURL)
            }
            if(req.body.splashURL) {
              guild.setSplash(req.body.splashURL)
            }
            if(req.body.discoverySplashURL) {
              guild.setDiscoverySplash(req.body.discoverySplashURL)
            }
            if(req.body.description == null) guild.edit({description: null})
            if(req.body.description) {
              guild.edit({description: req.body.description})
            }
            res.write(JSON.stringify(guild));
            res.end();
          }
      })


      this.app.get("/api/:secret/logs", async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        res.write(JSON.stringify(pmlogs))
        res.end()
       })
       this.app.post("/api/:secret/editBots", async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        if(!req.body) return res.send(`İnvalid Request!`), res.end();
        const adapter = new FileSync("../v14BOTSS/Global/Settings/_system.json")
        const db = low(adapter)
        let process = []
        console.log(req.body)
        if(req.body.guildID) {
          let guild = client.guilds.cache.get(req.body.guildID)
          if(!guild) return res.send(JSON.stringify({
            status: "ERROR",
            message: "Invalid Guild!"
          }))
          db.set("SERVER.ID", req.body.guildID).write()
          process.push("GUILD")
        }
        if(req.body.name) {
          db.set("SERVER.Name", req.body.name).write()
          process.push("NAME")
        }
        if(req.body.botStatus) {
          db.set("botStatus.Name", req.body.botStatus).write()
          process.push("STATUS")
        }
        if(req.body.Statistics) {
          db.set("TOKENS.Statistics", req.body.Statistics).write()
          process.push("T:STATISTICS")
        }
        if(req.body.Voucher) {
          db.set("TOKENS.Voucher", req.body.Voucher).write()
          process.push("T:MAINFRAME")
        }
        if(req.body.Sync) {
          db.set("TOKENS.SYNC", req.body.Sync).write()
          process.push("T:SYNC")
        }
        if(req.body.Controller) {
          db.set("TOKENS.CONTROLLER", req.body.Controller).write()
          process.push("T:CONTROLLER")
        }
        if(req.body.Security && req.body.Security.Main) {
          db.set("TOKENS.SECURITY.MAIN", req.body.Security.Main).write()
          process.push("T:S:MAIN")
        }
        if(req.body.Security && req.body.Security.One) {
          db.set("TOKENS.SECURITY.SEC_ONE", req.body.Security.One).write()
          process.push("T:S:ONE")
        }
        if(req.body.Security && req.body.Security.Two) {
          db.set("TOKENS.SECURITY.SEC_TWO", req.body.Security.Two).write()
          process.push("T:S:TWO")
        }
        if(req.body.Security && req.body.Security.Dists) {
          db.set("TOKENS.SECURITY.DISTS", req.body.Security.Dists).write()
          process.push("T:S:DISTS")
        }
        return res.send(JSON.stringify({
          status: "OK",
          completed: process,
          message: "SET!"
        }));
       })
      this.app.get("/api/:secret/get", async (req, res) => {
        if(req.params.secret != secretKey) return res.send("401");
        _sys = require('../v14BOTSS/Global/Settings/_settings');
        let guild = client.guilds.cache.get(this.client.sistem.SERVER.ID)
        let roles = []
        let senk = await GUILD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
        ayarlar = senk.Ayarlar 
        let type = req.query.type || 2
        if(type == 8) {
          const adapter = new FileSync("../v14BOTSS/Global/Settings/_system.json")
          const db = low(adapter)
          let kurulumgetir = db.get("SERVER.Install").value() || false
          return res.send(db.value() || {})
        }

        if(type == 21) {
          let PrivateCom = []
          let Commands = await PrivateCommand.find({})
          for(let i = 0; i < Commands.length; i++) {
            let komut = Commands[i]
            let oluşturan = guild.members.cache.get(komut.created)
            let access = []
            if(komut.allowed && komut.allowed.length > 0) komut.allowed.map(x => {
              let uye = guild.members.cache.get(x)
              if(uye) return access.push({
                type: "member",
                id: uye.id,
                avatar: uye.displayAvatarURL(),
                tag: uye.user.username,
              })
              let role = guild.roles.cache.get(x)
              if(role) return access.push({
                type: "role",
                name: `@${role.name}`,
                color: role.hexColor
              })
              return access.push({
                type: "more",
                name: x.replace("ADMINISTRATOR", "Yönetici")
                .replace("MANAGE_GUILD", "Sunucu Yönet")
                .replace("MANAGE_CHANNELS", "Kanal Yönet")
                .replace("MANAGE_ROLES", "Rol Yönet")
                .replace("MANAGE_NICKNAMES", "Nick Yönet")
                .replace("MANAGE_EMOJIS", "Emoji Yönet")
                .replace("MANAGE_WEBHOOKS", "Webhook Yönet")
                .replace("MANAGE_MESSAGES", "Mesaj Yönet")
                .replace("MANAGE_MESSAGE_DELETE", "Mesaj Silme Yönet")
              })
            })
            PrivateCom.push({
              name: komut.name,
              type: komut.type,
              created: oluşturan ? {
                id: oluşturan.id,
                tag: oluşturan.user.username,
                avatar: oluşturan.displayAvatarURL()
              } : undefined,
              date: tarihsel(komut.date),
              access: access && access.length > 0 ? access : undefined,
              prefix: komut.prefix ? `Prefix` : `Prefix Bulunmuyor!`,
            })
          }

          return res.send(JSON.stringify(PrivateCom));
        }
       if(type == 20) {
        senk = await GUILD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
        if(senk) return res.send(JSON.stringify({
          guildID: global.sistem.SERVER.ID,
          Ayarlar: senk.Ayarlar,
          talentPerms: senk.talentPerms,
          Caches: senk.Caches,
          Date: tarihsel(Date.now())
        }))
        if(!senk) return res.send({"message": "error", "status": "403"})
       }
       if(type == 19) {
        let _get = await Custom.find({})
        let arr = []
        _get.map(x => {
          arr.push({
            Name: x.Name,
            Text: x.Text,
            Roles: x.Roles.map(r => {
              return guild.roles.cache.get(r) ? guild.roles.cache.get(r).name : "@Rol Bulunamadı!"
            }).join(", "),
            Secret: x.Secret,
            Date: tarihsel(x.Date),
            Access: x.Access ? x.Access.map(r => {
              return guild.roles.cache.get(r) ? guild.roles.cache.get(r).name : "@Rol Bulunamadı!"
            }).join(", ") : [],
            Author: {
              id: guild.members.cache.get(x.Author) ? guild.members.cache.get(x.Author).user.id : client.user.id,
              tag: guild.members.cache.get(x.Author) ? guild.members.cache.get(x.Author).user.username : client.user.username,
              avatar: guild.members.cache.get(x.Author) ? guild.members.cache.get(x.Author).displayAvatarURL() : client.user.displayAvatarURL(),
            }
          })

        })
        return res.send(JSON.stringify(arr));
       }
        if(type == 18) {
          let _get = await Shops.find({})
          let arr = []
          _get.map(x => {
            arr.push({
              name: x.name,
              desc: x.desc,
              coin: x.coin,
              gold: x.gold,
              emoji: guild.emojis.cache.find(e => e.id == x.emoji || e.name == x.emoji) ? guild.emojis.cache.find(e => e.id == x.emoji || e.name == x.emoji).url : "-" ,
              role: guild.roles.cache.get(x.roleID) ? guild.roles.cache.get(x.roleID).name : `Rol'e Bağlı Değil!`,
            })
          })
          
          return res.send(JSON.stringify(arr));
        }
        if(type == 16) {

          let _get = await Sorumluluk.find({})

          let arr = []
          _get.map((x, index) => {

            arr.push({
              isim: x.name,
              sorumluluk: guild.roles.cache.get(x.role) ? guild.roles.cache.get(x.role).name : "@Rol Bulunamadı",
              lider: x.leaders.map(x => guild.roles.cache.get(x) ? guild.roles.cache.get(x).name : "@Rol Bulunamadı").join(", "),
              kisiler: guild.roles.cache.get(x.role) ? {
                size: Number(guild.roles.cache.get(x.role).members.size),
                members: guild.roles.cache.get(x.role).members.map(x => {
                  let det = {
                    id: x.id,
                    tag: x.user.username,
                    avatar: x.displayAvatarURL(),
                  }
                  return det;
                }) 
              } : {
                size: 0,
                members: []
              },
              olusturan: guild.members.cache.get(x.created) ? {
                id: x.created,
                avatar: guild.members.cache.get(x.created).displayAvatarURL({dynamic: true}),
                tag: guild.members.cache.get(x.created).user.username
              } : {
                id: client.user.id,
                avatar: guild.members.cache.get(client.user.id).displayAvatarURL({dynamic: true}),
                tag: guild.members.cache.get(client.user.id).user.username
              },
              tarih: tarihsel(x.date)
            })

          })

          return res.send(JSON.stringify(arr));
        }
        if(type == 14) {
          let staffs = []  
          let staff_data = await UPSTAFF.find({})
          staff_data.filter(x => guild.members.cache.has(x._id)).forEach(x => {
            
            let uye = guild.members.cache.get(x._id)
            if(uye) {
              staffs.push({
                id: uye.id,
                avatar: uye.user.displayAvatarURL({dynamic: true}),
                tag: uye.user.username,
                roles: uye.roles.cache.filter(r => roller.Yetkiler.includes(r.id) ||
                roller.altYönetimRolleri.includes(r.id) ||
                roller.yönetimRolleri.includes(r.id) ||
                roller.üstYönetimRolleri.includes(r.id) ||
                roller.kurucuRolleri.includes(r.id)).map(rol => rol.name).join(", "),
                başlama: tarihsel(x.Baslama),
                rolde: moment.duration(Date.now() - x.Rolde).format('D [gün,] H [saat,] m [dakika]'),
                görev: x.Yönetim ? "Görev" : `Otomatik Yükseltim`,
                puan: x.Point || 0
              })
            }
          })
          return res.send(JSON.stringify(staffs)),res.end();
        
        }
        if(type == 17) {
          let task_arr = []
          let task_data = await TASKS.find({})
          
          task_data.map(t => {
            let role = guild.roles.cache.get(t.roleID)
            task_arr.push({
              id: t.roleID,
              role: `${role ? role.name : "@Rol Bulunamadı!"}`,
              allvoice: `${t.AllVoice} Saat`,
              public: `${t.publicVoice} Saat`,
              invite: `${t.Invite}`,
              tagged: `${t.Tagged}`,
              staff: `${t.Staff}`,
              register: `${t.Register}`,
              tasks: t.countTasks,
              reward: t.Reward,
              members: role ? role.members.size : 0,
              time: t.Time ? moment.duration(t.Time - Date.now()).format('D [gün,] H [saat,] m [dakika]') : `Süresiz Görev`,
              date: tarihsel(t.Date),
            })
          })
          res.send(task_arr);
          res.end();
          return 
        }
        if(type == 10) {
          const adapter = new FileSync("../v14BOTSS/Global/Settings/_system.json")
          const db = low(adapter)
          return res.send(db.get("PACKAGE").value());
        }
        if(type == 11) {
          let adp = new FileSync("../v14BOTSS/Global/Settings/_emojis.json")
          let edb = low(adp)
          let emj = edb.value()
          let result = []
          for(var i in emj) {
            let emjbul = client.emojis.cache.get(emj[i]) || client.emojis.cache.find(x => x.name == emj[i] || x.name.includes(emj[i]))
            if(emjbul) {
              result.push({name: i, value: {id: emjbul.id, url: emjbul.url, name: emjbul.name}});
            } else {
              result.push({name: i, value: {id: undefined, url: undefined, name: emj[i]}});
            }
          }

         
          result = result.slice(0, 32);
          return res.send(result);
        }
        if(type == 15) {
          let check = await GUILD_SETTINGS.findOne({guildID: guild.id})
          let cmd = check.talentPerms 

          let coms = []
          if(cmd) cmd.map(x => {
            let kullanabilcekler = []
            let verilecek = []
            if(x.Permission && x.Permission.length > 0) x.Permission.map(x => {
              let _rolgetiramkçocu = guild.roles.cache.get(x)
              if(_rolgetiramkçocu) kullanabilcekler.push(_rolgetiramkçocu.name)
            })

            if(x.Roles && x.Roles.length > 0) x.Roles.map(x => {
              let _rolgetiramkçocu = guild.roles.cache.get(x)
              if(_rolgetiramkçocu) verilecek.push(_rolgetiramkçocu.name)
            })
            let author;
            if(x.Author && guild.members.cache.get(x.Author)) author = guild.members.cache.get(x.Author)

            coms.push({
              Command: x.Commands,
              Permissions: kullanabilcekler,
              Roles: verilecek,
              Date: tarihsel(x.Date),
              Author: author ? {
                id: author.id,
                tag: author.user.username,
                avatar: author.user.displayAvatarURL({dynamic: true})
              } : undefined,
               
            })
          })
          return res.send(JSON.stringify(coms));
        }
        if(type == 12) {{
          let arr = []
          
          guild.emojis.cache.map(x => {
            let _rol = []
            if(x._roles) {
              x._roles.map(x => {
                let getrol = guild.roles.cache.get(x)
                if(getrol) _rol.push(getrol.name)
              })
            }
            arr.push({
              id: x.id, name: x.name, url: x.url, roles: _rol.length > 0 ? _rol.join(", ") : "Rol'e özel değil!"
            })
          })
          return res.send(JSON.stringify(arr))
        }}
        if(type == 7) {
            let _infos = []
            Bots.forEach(bot => {
              _infos.push({
                id: bot.user.id,
                username: bot.user.username,
                avatar: bot.user.avatar ? `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png?size=2048` : null,
                discriminator: bot.user.discriminator,
                token: bot.token,
              })
            })
           return res.send(JSON.stringify(_infos))
        }
        if(type == 13) {
          let members = []
          let _members = guild.members.cache
          let own = await guild.fetchOwner()
         
          _members.filter(x => !x.user.bot).sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).map(x => {
            x.tag = x.user.username
            x.joinedTimestamp = x.user.createdTimestamp
            let roles = [] 
            x.roles.cache.filter(x => x.name != "@everyone").map(r => {
              roles.push({name: r.name, color: r.color})
            })
            x.roller = roles
            if(own.id == x.id) {
              x.owner = true;
              members.push(x)
            } else {
              members.push(x)
            }
          })
          return res.send(JSON.stringify(members));
        }

        if(type == 99) {
          let _guild = {
            id: guild.id,
            name: guild.name,
            banner: guild.bannerURL({dynamic: true, format: "png", size: 2048}),
            icon: guild.iconURL({dynamic: true, format: "png", size: 2048}),
            members: guild.memberCount,
            message: "ok"
          }
          res.write(JSON.stringify(_guild));
          res.end();
          return;
        }

        if(type == 3) {
          let members = []
          let _members = guild.members.cache
          _members.filter(x => !x.user.bot).sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).reverse().map(x => {
            members.push(x.id)
          })

          let recordscuklar = []
          let _users = await Users.find({})
          _users.filter(x => guild.members.cache.get(x._id) && x.Registrant).map(x => {
            recordscuklar.push(x._id)
          })
    

          let Last = {
            tagged: senk.Caches.lastTagged || "719117042904727635",
            leaving: senk.Caches.latest,
            record: senk.Caches.lastRecord || "719117042904727635",
          }


          let sonTaglı = client.users.cache.get(Last.tagged) || client.users.cache.get("719117042904727635")
          let sonÇıkan = Last.leaving || client.users.cache.get("719117042904727635")
          let sonKayıt = client.users.cache.get(Last.record) || client.users.cache.get("719117042904727635")

          let lastname;
          let kayıtbilgisi = await Users.findOne({_id: sonKayıt.id})
          if(kayıtbilgisi && kayıtbilgisi.Name) lastname = kayıtbilgisi.Name
          


          let lastHours = _members.filter(a => (new Date().getTime() - a.joinedTimestamp) < 3600000).size
          let lastDays = _members.filter(a => (new Date().getTime() - a.joinedTimestamp) < 86400000).size
          let lastWeeks = _members.filter(a => (new Date().getTime() - a.joinedTimestamp) < 604800000).size
          let lastMontly = _members.filter(a => (new Date().getTime() - a.joinedTimestamp) < 2629800000).size
          let voiceMembers = _members.filter(x => x.voice.channel && !x.user.bot).size
          let botMembers = _members.filter(x => x.user.bot).size
          let deafMembers = _members.filter(x => x.voice.channel && x.voice.selfDeaf && !x.user.bot).size
          let muteMembers = _members.filter(x => x.voice.channel && x.voice.selfMute && !x.user.bot).size
          let streamMembers = _members.filter(x => x.voice.channel && x.voice.streaming).size
          let camMembers = _members.filter(x => x.voice.channel && x.voice.selfVideo).size
          let tagMembers = ayarlar.type ? _members.filter(x => x.roles.cache.has(roller.tagRolü) || x.user.username.includes(ayarlar.tag)).size : 0
          let toplamAktif = _members.filter(m => m.presence && m.presence.status !== "offline").size
          let own = await guild.fetchOwner()
          own = client.users.cache.get(own.id)
          let lastmember = client.users.cache.get(members[members.length - 1])
          let _guild = {
            id: guild.id,
            name: guild.name,
            banner: guild.bannerURL({dynamic: true, format: "png", size: 2048}),
            icon: guild.iconURL({dynamic: true, format: "png", size: 2048}),
            members: guild.memberCount,
            roles: guild.roles.cache.size,
            channels: guild.channels.cache.size,
            emojis: guild.emojis.cache.size,
            stickers: guild.stickers.cache.size,
            vanityURL: guild.vanityURLCode,
            discoverySplashURL: guild.discoverySplashURL({dynamic: true, format: "png", size: 2048}),
            verificationLevel: guild.verificationLevel,
            premiumSubscriptionCount: guild.premiumSubscriptionCount ,
            premiumProgressBarEnabled: guild.premiumProgressBarEnabled,
            premiumTier: guild.premiumTier,
            description: guild.description ? guild.description : "Açıklama bulunamadı.",
            splash: guild.splashURL({dynamic: true, format: "png"}),
            charts: senk.Caches.Charts || [],
            stats: {
              online: toplamAktif,
              offline: guild.memberCount - toplamAktif,
              lastmember: lastmember ? lastmember : undefined,
              hours: lastHours,
              days: lastDays,
              weeks: lastWeeks,
              montly: lastMontly,
              voice: voiceMembers,
              bots: botMembers,
              deafs: deafMembers,
              mutes: muteMembers,
              streams: streamMembers,
              cams: camMembers,
              lrecords: {
                id: sonKayıt,
                name: lastname || sonKayıt.tag
              },
              leaving: sonÇıkan,
              ltagged: sonTaglı,
              records: recordscuklar.length || 0,
              taggeds: tagMembers
            },
            owner: own,
            message: "ok"
          }
          res.write(JSON.stringify(_guild));
          res.end();
            return 
        }
        if(type == 4) {
          let memberid = req.query.memberId
          if(!memberid) return res.write(JSON.stringify({message: "error"})),res.end();
          let _member = guild.members.cache.get(memberid)
          if(!_member) return res.write(JSON.stringify({message: "error"})),res.end();
          res.write(JSON.stringify(_member));
          res.end();
            return 
        }
        if(type == 5) {
          let memberid = req.query.memberId
          if(!memberid) return res.write(JSON.stringify({message: "error"})),res.end();
          let _member = client.users.cache.get(memberid)
          if(!_member) return res.write(JSON.stringify({message: "error"})),res.end();
          res.write(JSON.stringify(_member));
          res.end();
            return 
        }
        if(type == 9) {
          let data = await GUARD_SETTINGS.findOne({guildID: global.sistem.SERVER.ID})
          let datas = [
            { name: "guildProtection", display: "Sunucu Koruması", type: "acmali", category: "GUILD", value: data.guildProtection, description: "Sunucu içerisinde yapılan izinsiz olan izinleri engeller."},
            { name: "limit", display: "Sunucu Koruma Limiti", type: "acmali", category: "GUILD", value: data.limit, description: "Sunucu içerisinde yapılan ve güvenlikte izni olan insanların belirli limite geldiğinde engelleme işlemini gerçekleştirir."},
            { name: "auditLimit", display: "Koruma Limiti", type: "limit", category: "GUILD", value: data.auditLimit, description: "Belirlenen rakamı o kadar işlem yapıldığı zaman otomatik olarak engeller."},
            { name: "auditInLimitTime", display: "Koruma Limiti", type: "tekil", category: "GUILD", value: data.auditInLimitTime, description: "Belirlenen zaman kadar yukarda ayarlanan Koruma Limiti sayısını geçince otomatik işlem engeller."},

            { name: "sh", display: "<h5 style='color: whitesmoke;'>Self URL Sistemi</h5>", type: "BAŞLIK", category: "GUILD", value: "", description: "Tekrarlanacak(SPAM) URL belirtiniz."},
            { name: "selfTokens", display: "Tekrarlayan Tokenler", type: "cogul", category: "GUILD", value: data.selfTokens , description: "Sunucu İçerisinde Sunucu Yönet veya Yönetici yetkisine sahip kullanıcıların veya yan hesapların tokenlerini girerseniz onlarla tekrarlar."},
            { name: "spamURL", display: "Sunucu URL", type: "tekil", category: "GUILD", value: data.spamURL, description: "Tekrarlanacak(SPAM) URL belirtiniz."},
            { name: "urlSpam", display: "URL Tekrarlayıcısı", type: "acmali", category: "GUILD", value: data.urlSpam, description: "Hoş geldin botları ve dağıtıcı botlar sürekli flood atarak URLinizi korumaya çalışır."},
            { name: "sh", display: "<h5 style='color: whitesmoke;'>Diğer Koruma Yönetimi</h5>", type: "BAŞLIK", category: "GUILD", value: "", description: "Tekrarlanacak(SPAM) URL belirtiniz."},
            { name: "roleGuard", display: "Rol Koruması", type: "acmali", category: "GUILD", value: data.roleGuard, description: "Sunucuda rol silinmesini oluşturulmasını düzenlenmesini engeller."},
            { name: "channelGuard", display: "Kanal Koruması", type: "acmali", category: "GUILD", value: data.channelGuard, description: "Sunucuda kanal silinmesini oluşturulmasını düzenlenmesini engeller."},
            { name: "botGuard", display: "Bot Koruması", type: "acmali", category: "GUILD", value: data.botGuard, description: "Sunucuya bot sokulmasını veya entegrasyon eklenmesini düzenlenmesini kaldırılmasını engeller."},
            { name: "everyoneGuard", display: "Everyone & Here Koruması", type: "acmali", category: "GUILD", value: data.everyoneGuard, description: "Sunucuda everyone ve here etiketlerinin atılmasını engeller."},
            { name: "webhookGuard", display: "Webhook Koruması", type: "acmali", category: "GUILD", value: data.webhookGuard, description: "Sunucuda webhook oluşturulmasını silinmesini düzenlenmesini engeller."},
            { name: "guildGuard", display: "Sunucu Koruması", type: "acmali", category: "GUILD", value: data.guildGuard, description: "Sunucu düzenlenmesini tamamiyle engeller."},
            { name: "webGuard", display: "Tarayıcı(Web) Koruması", type: "acmali", category: "GUILD", value: data.webGuard, description: "Sunucuda yetkisi olan kullanıcıların tarayıcıya girdiğinde yetkisini çeker ve sekme açmasını engeller."},
            { name: "offlineGuard", display: "Çevrim-Dışı Koruması", type: "acmali", category: "GUILD", value: data.offlineGuard, description: "Sunucuda tarayıcı bilgisi alabilmesi için çevrim-dışı kalmamaması gerekmektedir o yüzden dolayı bu açılırsa daha güvenli olur çevrim dışı olduğunda yetkisi çekilir çevrim içi olduğunda yetkisi geri verilir."},
            { name: "emojiGuard", display: "Emoji Korumasısı", type: "acmali", category: "GUILD", value: data.emojiGuard, description: "Sunucuda emoji silinmesini oluşturulmasını düzenlenmesini engeller."},
            { name: "stickerGuard", display: "Çıkartma Korumasısı", type: "acmali", category: "GUILD", value: data.stickerGuard, description: "Sunucuda sticker silinmesini oluşturulmasını düzenlenmesini engeller."},
            { name: "pruneGuard", display: "Üye Çıkartma Koruması", type: "acmali", category: "GUILD", value: data.pruneGuard, description: "Sunucuda üye çıkarma işlemi tamamiyle engeller."},
            { name: "memberRoleGuard", display: "Üye(Rol/Ver) Koruması", type: "acmali", category: "GUILD", value: data.memberRoleGuard, description: "Sunucuda bir kullanıcıya rol verip/alabilmesini engeller."},
            { name: "banGuard", display: "Ban Koruması", type: "acmali", category: "GUILD", value: data.banGuard, description: "Sunucuda sağ-tık ban atılmasını ve kaldırılmasını engeller."},
            { name: "muteGuard", display: "Susturma Koruması", type: "acmali", category: "GUILD", value: data.muteGuard, description: "Sunucuda sağ-tık susturma atılmasını ve kaldırılmasını engeller."},
            { name: "kickGuard", display: "Atma Koruması", type: "acmali", category: "GUILD", value: data.kickGuard, description: "Sunucuda sağ-tık sunucudan atmayı engeller."},
            { name: "disconnectGuard", display: "Bağlantı Kesme Koruması", type: "acmali", category: "GUILD", value: data.disconnectGuard, description: "Sunucuda sağ-tık bağlantı kesmeyi engeller."},
            { name: "nicknameGuard", display: "İsim Koruması", type: "acmali", category: "GUILD", value: data.nicknameGuard, description: "Sunucuda sağ-tık isim değiştirmeyi engeller."},

          ]
          roles = datas
        }
        if(type == 6) {
          let sdata = _sys.statdeğişken
          if(req.query.filter) {
            sdata = sdata.filter(x => x.name == req.query.filter)
          }
          sdata.map((x) => { 
            if(x.type.includes("kanal")) {
              roles.push({ name: x.name, type: x.type, display: x.display, category: x.category, value: Array.isArray(ayarlar[x.name]) ? ayarlar[x.name].filter(x => guild.channels.cache.get(x)).map(x => { 
                let kanal = guild.channels.cache.get(x)
                if(kanal) return `#${kanal.name}`
              }).join(", ")  : guild.channels.cache.get(ayarlar[x.name]) ? `#${guild.channels.cache.get(ayarlar[x.name]).name}` : "Kanal Bulunamadı!" , ctype: x.ctype ? x.ctype : undefined, description: x.description})
            } else if(x.type.includes("rol")) {
              roles.push({ name: x.name, display: x.display, type: x.type , category: x.category, value: Array.isArray(ayarlar[x.name]) ? ayarlar[x.name].filter(x => guild.roles.cache.get(x)).map(x => { 
                let kanal = guild.roles.cache.get(x)
                if(kanal) return `@${kanal.name}`
              }).join(", ")  : guild.roles.cache.get(ayarlar[x.name]) ? `@${guild.roles.cache.get(ayarlar[x.name]).name}` : "Rol Bulunamadı!" , description: x.description})
            } else {
              roles.push({ name: x.name, display: x.display, type: x.type , category: x.category, value: ayarlar[x.name], description: x.description})
            }
          })
        }
        if(type == 0) {
          let data = _sys.değişkenler
          if(req.query.filter) {
            data = data.filter(x => x.name == req.query.filter)
          }
          data.map((x) => {
            if(ayarlar[x.name]) {
              if(x.type.includes("kanal")) {
                roles.push({ name: x.name, type: x.type , display: x.display, category: x.category, value: Array.isArray(ayarlar[x.name]) ? ayarlar[x.name].filter(x => guild.channels.cache.get(x)).map(x => { 
                  let kanal = guild.channels.cache.get(x)
                  if(kanal) return `#${kanal.name}`
                }).join(", ")  : guild.channels.cache.get(ayarlar[x.name]) ? `#${guild.channels.cache.get(ayarlar[x.name]).name}` : "Kanal Bulunamadı!" , ctype: x.ctype ? x.ctype : undefined, description: x.description})
              } else if(x.type.includes("rol")) {
                roles.push({ name: x.name, type: x.type , display: x.display, category: x.category, value: Array.isArray(ayarlar[x.name]) ? ayarlar[x.name].filter(x => guild.roles.cache.get(x)).map(x => { 
                  let kanal = guild.roles.cache.get(x)
                  if(kanal) return `@${kanal.name}`
                }).join(", ")  : guild.roles.cache.get(ayarlar[x.name]) ? `@${guild.roles.cache.get(ayarlar[x.name]).name}` : "Rol Bulunamadı!" , description: x.description})
              } else {
                roles.push({ name: x.name, type: x.type , display: x.display, category: x.category, value: ayarlar[x.name], description: x.description})
              }
  
            } else {
              roles.push({ name: x.name, type: x.type , display: x.display, category: x.category, description: x.description})
            }
          })

         
        
        } else if(type == 1) {
          let filter = req.query.filter || "ALL"
          if(filter != "ALL") {
            guild.roles.cache.filter(x => x.name.includes(filter) || x.id == filter).map(x => {
              roles.push({name: x.name, position: x.position, id: x.id, color: x.hexColor, icon: x.iconURL() ? x.iconURL() : null, managed: x.managed, hoist: x.hoist, mentionable: x.mentionable})
            })
          } else {
            guild.roles.cache.map(x => {
              roles.push({name: x.name, position: x.position, id: x.id, color: x.hexColor, icon: x.iconURL() ? x.iconURL() : null, managed: x.managed, hoist: x.hoist, mentionable: x.mentionable})
            })
          }
        } else if(type == 2) {
          let filter = req.query.filter || "ALL"
          if(filter == "CATVOICE") {
            guild.channels.cache.filter(x => x.type == "GUILD_CATEGORY" || x.type == "GUILD_VOICE" ).map(x => {
              roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
            })
          } else if(filter == "CATCHAT") {
            guild.channels.cache.filter(x => x.type == "GUILD_CATEGORY" || x.type == "GUILD_TEXT" ).map(x => {
              roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
            })
          } else if(filter == "CATEGORY") {
            guild.channels.cache.filter(x => x.type == "GUILD_CATEGORY").map(x => {
              roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
            })
          } else if(filter == "VOICE") {
            guild.channels.cache.filter(x => x.type == "GUILD_VOICE").map(x => {
              roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
            })
          } else if(filter == "TEXT") {
            guild.channels.cache.filter(x => x.type == "GUILD_TEXT").map(x => {
              roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
            })
          } else {
            let kanal = guild.channels.cache.find(x => x.id == req.query.filter)
            if(kanal) {
                roles.push({name: kanal.name, type: kanal.type, position: kanal.position, id: kanal.id, parent: kanal.parentId ? kanal.parentId : undefined})
            } else {
              guild.channels.cache.map(x => {
                roles.push({name: x.name, type: x.type, position: x.position, id: x.id, parent: x.parentId ? x.parentId : undefined})
              })
            }
          }
        } 

        res.write(JSON.stringify(roles));
        res.end();
      });
      this.app.get("/error", (req, res) => {
        res.send('OK')
      });
      
      this.app.use((req, res) => error(res, 404, "Aradığınız sayfa bulunamadı. Lütfen doğru bir bağlantı kullanın."));
      // </> Pages </>
      
      
      // </> Functions </>
      const error = (res, statuscode, message) => {
        return res.redirect(url.format({ pathname: "/error", query: { statuscode, message }}));
      };
      

        
        this.server = https.createServer({
            key: fs.readFileSync('./private.key'),
            cert: fs.readFileSync('./certificate.crt'),

        }, this.app).listen(port, '0.0.0.0', () => {
          let Stat = sistem.TOKENS.Statistics
          let Voucher = sistem.TOKENS.Voucher
          let Controller = sistem.TOKENS.CONTROLLER
          let Sync = sistem.TOKENS.SYNC
          let SEC_MAIN = sistem.TOKENS.SECURITY.MAIN
          let SEC_ONE = sistem.TOKENS.SECURITY.SEC_ONE
          let SEC_TWO = sistem.TOKENS.SECURITY.SEC_TWO
          let DISTS = sistem.TOKENS.SECURITY.DISTS
          let WELCOMES = sistem.TOKENS.WELCOME.WELCOMES
         
          let allTokens = [Stat, Voucher, Sync, Controller, SEC_MAIN, SEC_ONE, SEC_TWO, ...WELCOMES, ...DISTS]
          const { Client } = require("discord.js");
          allTokens.forEach(async (token) => {
            let botClient;
            if(sistem.TOKENS.SECURITY.DISTS.includes(token) || SEC_TWO == token) {
                botClient = new Client({
                    intents: [32767],
                    presence: { status: "invisible" },
                  }); 
            } else {
                botClient = new Client({
                    intents: [32767],
                    presence: {activities: [{name: sistem.botStatus.Name}], status: sistem.botStatus.Status}
                  });
        
            }
              botClient.on("ready", async () => {  
                  Bots.push(botClient)
                
              })
              await botClient.login(token).catch(err => {})
          })
          client.logger.log(`Listened to Web Interface ( 0.0.0.0:${port} )`, "interface");
          client.on('ready', () => {
            let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
            if(!guild) {
              console.log(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot%20applications.commands`)
              return process.exit();
            }
            setInterval(() => {
              if(state == "NO-PAYMENT") {
                ls = children.exec(`pm2 stop 1 2 3 4 5 7 0`);
                ls.stdout.on('data', async function (data) {});
              }
            }, 3000)
          })
            var CronJob = require('cron').CronJob
            let günlükveriler = new CronJob('0 0 * * *', async function() { 
                let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
                if(!guild) return;
                let _members = guild.members.cache
                let datas = {
                    girişler: _members.filter(a => (new Date().getTime() - a.joinedTimestamp) < 86400000).size,
                    sesler: _members.filter(x => x.voice.channel && !x.user.bot).size,
                    üyeler: guild.memberCount,
                    aktifler: _members.filter(m => m.presence && m.presence.status !== "offline").size,
                    tarih: Date.now()
                }
              await GUILD_SETTINGS.updateOne({guildID: global.sistem.SERVER.ID}, {$push: {"Caches.Charts": datas}}, {upsert: true});
              client.logger.log(`Günlük Grafik Verileri Eklendi.`, "interface");
            }, null, true, 'Europe/Istanbul')
            günlükveriler.start(), client.logger.log(`Günlük grafik zamanlayıcısı aktif edildi.`, "interface")
            



            
        })
        }
};

module.exports = { Websocket }