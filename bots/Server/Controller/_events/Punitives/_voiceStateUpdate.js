const { VoiceState, EmbedBuilder } = require("discord.js");
const forceBans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const Mutes = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const VMute = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const Jails = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 */
module.exports = async (oldState, newState) => {
    if((!oldState.channel && newState.channel) || (oldState.channel && newState.channel)){
        let member = newState.member;
        if(!member) return;
        if(kanallar && kanallar.sorunCozmeKategorisi && newState.channel.parentId == ayarlar.sorunCozmeKategorisi) return;
        let data = await VMute.findOne({ _id: member.id })
        if(data){
          if(data.Duration && Date.now() >= data.Duration){
            if(member && member.voice.channel) await member.voice.setMute(false).catch(err => {});
              await Punitives.updateOne({ No: data.No }, { $set: { "Active": false, Expried: Date.now()} }, { upsert: true })
              await VMute.findByIdAndDelete(member.id)
          } else if(member.voice.channel && !member.voice.serverMute){
            if(member && member.voice.channel) await member.voice.setMute(true);
          }
        }
      }
}

module.exports.config = {
    Event: "voiceStateUpdate"
}

client.on("voiceChannelJoin", async (member, channel) => {
  if(!member) return;
  if (member.user.bot) return;
  if((kanallar.ayrıkKanallar && kanallar.ayrıkKanallar.some(x => channel.id == x))|| channel.parentId == kanallar.streamerKategorisi || channel.parentId == kanallar.registerKategorisi) return;
  let data = await VMute.findOne({ _id: member.id })
  if(!data) {
    if(member.voice && member.voice.serverMute) await member.voice.setMute(false).catch(err => {});
  }
})

client.on("voiceChannelSwitch", async (member, old, channel) => {
  if(!member) return;
  if (member.user.bot) return;
  if((kanallar.ayrıkKanallar && kanallar.ayrıkKanallar.some(x => channel.id == x))|| channel.parentId == kanallar.streamerKategorisi || channel.parentId == kanallar.registerKategorisi) return;
  let data = await VMute.findOne({ _id: member.id })
  if(!data) {
    if(member.voice && member.voice.serverMute) await member.voice.setMute(false).catch(err => {});
  }
})