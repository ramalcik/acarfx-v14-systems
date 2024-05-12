const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
let sayi = 0;
let iltifat = [
  "Yaşanılacak en güzel mevsim sensin.",
  "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
  "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
  "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
  "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
  "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
  "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
  "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
  "Bir gamzen var sanki cennette bir çukur.",
  "Gecemi aydınlatan yıldızımsın.",
  "Ponçik burnundan ısırırım seni",
  "Bu dünyanın 8. harikası olma ihtimalin?",
  "fıstık naber?",
  "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
  "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
  "Müsaitsen aklım bu gece sende kalacak.",
  "Gemim olsa ne yazar liman sen olmadıktan sonra...",
  "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
  "Sabahları görmek istediğim ilk şey sensin.",
  "Mutluluk ne diye sorsalar, cevabı gülüşünde ve o sıcak bakışında arardım.",
  "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
  "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
  "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
  "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
  "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
  "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
  "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
  "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
  "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
  "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
  "Gülüşün ne güzel öyle, cumhuriyetin bir gelişi gibi sanki",
  'Ne yaparsan yap, sen her zaman çok doğalsın.',
  'Sen, tanıdığım en cesur insansın. Keşke senin gibi olabilseydim.',
  'Sen tanıdığım en tatlı insansın.',
  'Seninle konuşmak, ferah bir nefes almak gibidir.',
  'Bugün harika iş çıkardın. Seninle çalışmayı çok seviyorum.',
  'Enerjinin bulaşıcı olduğunu kendi gözlerimle gördüm. Sen mükemmel bir insansın.',
  'O kadar nazik ve anlayışlısın ki etrafındaki herkesi daha iyi bir insan yapmayı başarıyorsun.',
  'En kötü durumları bile eğlenceli bir hale dönüştürmene bayılıyorum.',
  'Keşke senin kadar mükemmel bir insan olabilseydim.',
  'Yaratıcılığın çok yüksek bir seviyede.',
  'İnsanlara güvenmeni seviyorum. Bu anlayışının bir kısmını bana gönderir misin?',
  'Ünlü olduğun zaman, hayran kulübünün tek başkanı olmak istiyorum.',
  'Çocuklarına çok iyi örnek oluyorsun. Her şeyi doğru yapmana bayılıyorum.',
  'Sen yeri doldurulamaz bir insansın.',
  'Farkında olduğundan daha harikasın.',
  'Senin gibi bir arkadaşımın olması özel hissetmeme neden oluyor.',
  'Beni hiçbir zaman hayal kırıklığına uğratmıyorsun. Ne olursa olsun sana güvenebileceğimi biliyorum.',
  'Senin yanında olduğum zaman kendimi çok şanslı ve özel hissediyorum.',
  'Makyaj doğal güzelliğini kapatıyor resmen...',
  'Saçların denizin huzurunu yansıtıyor.',
  'Senin gülümsemen benim en derin mutluluğum.',
  'Harika bir tarzın var. Tarzına sahip olmayı çok isterdim.',
  'Sen herkesin hayatında olması gereken bir insansın.',
  'Masallardaki prensesin şekil bulmuş halisin.',
  'Şarkılarımın, şiirlerimin ilham kaynağısın.',
  'Yanında hissetmediğim güven ve huzuru hissediyorum.',
  'Bu kadar tatlı olmayı nasıl başarıyorsun?',
  'Gözlerin en güzel ışık kaynağım.',
  'En güzel iyikimsin.',
  'Yaşadığım tüm kötülüklere sen karşıma alıp izleyerek baş edebilirim.',
  'Çiçekleri kıskandıran bir güzelliğe sahipsin.',
  'Sen benim tüm imkansızlıklarıma rağmen hayattaki en değerlimsin',
  'Sen benim en güzel manzaramsın.',
  'Enerjin içimi aydınlatıyor.'
];

let selamlananlar = new Map()

module.exports = async (message) => {
  let Data = await GUILDS_SETTINGS.findOne({_id: 1})
  if(Data) ayarlar = Data.Ayarlar
  if (!message.guild) return;
  if (message.author.bot) return;
  let kelimeler = ["sa","sea","selamın aleyküm", "selamun aleyküm"]
  if(!selamlananlar.get(message.author.id) && kelimeler.some(word => message.content.toLowerCase() === word)) {
    selamlananlar.set(message.author.id, true)
    message.reply({content: `Aleyküm Selam Dostum Hoş Geldin!`}).then(x => {
      setTimeout(() => {
          setTimeout(() => {
            selamlananlar.delete(message.author.id)
          }, 30000);
          x.delete().catch(err => {})
      }, 7500);
    })

  }
  if(ayarlar && ayarlar.chatİltifat) {
    if (message.channel.id != kanallar.chatKanalı) return;
    sayi++
    if (sayi >= 150) {
      sayi = 0;
      let rand = iltifat[Math.floor(Math.random() * iltifat.length)]
      message.reply(`${rand}`).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 12500);
      });
    }
  }
} 
  
  module.exports.config = {
      Event: "messageCreate"
  };
  