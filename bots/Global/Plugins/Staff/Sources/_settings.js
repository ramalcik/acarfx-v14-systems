let _chats = [
        {id: ayarlar.chatKanalı ? client.channels.cache.get(ayarlar.chatKanalı) ? client.channels.cache.get(ayarlar.chatKanalı).parentId : "x" : "x", isim: `${ayarlar.serverName} Chat`},
        {id: ayarlar.streamerKategorisi, isim: "Streamer Chat"},
        {id: ayarlar.sorunCozmeKategorisi, isim: "Sorun Çözme Chat"},
        {id: ayarlar.registerKategorisi, isim: "Kayıt Chat"},
        ...ayarlar._chats

]
let _voices = [
        {id: ayarlar.publicKategorisi, isim: "Public Odaları"},
        {id: ayarlar.registerKategorisi, isim: "Kayıt Odaları"},
        {id: ayarlar.sorunCozmeKategorisi, isim: "Sorun Çözme"},
        {id: ayarlar.streamerKategorisi, isim: "Streamer Odası"},
        {id: ayarlar.sleepRoom, isim: "Sleep Room (AFK)"},
        ...ayarlar._voices
        
]

module.exports = {
    
    generalChatCategory: _chats.find(x => x.isim == `${ayarlar.serverName} Chat`).id,
    musicRooms: ayarlar.musicRooms || [],

    chatCategorys: _chats || [],

    voiceCategorys: _voices || [],

    system: ayarlar.Sistem,
    endstaff: ayarlar.sonYetki || "Ayarlanmadı!",
    accessPointChannels: [
        ..._voices.map(x => x.id),
        ...ayarlar.izinliKategoriler,
    ],
 
    fullPointChannels: [
        ..._voices.filter(x => x.isim.includes("Public") || x.isim.includes("Kayıt") ||x.isim.includes("Sorun") || x.isim.includes("Streamer")).map(x => x.id),
        ...ayarlar.fullPuanKategoriler,
    ],

    "points": {
        voice: ayarlar.tamSesPuan || 5.5,
        halfVoice: ayarlar.yarımSesPuan || 1,
        invite: ayarlar.davetPuan || 1,
        message: ayarlar.mesajPuan || 0.1,
        tagged: ayarlar.taglıPuan || 20,
        staff: ayarlar.yetkiliPuan || 20,
        record: ayarlar.kayıtPuan || 2.5,
        tasks: ayarlar.görevPuan || 5,
    },

    staffs: ayarlar._staffs || []
}