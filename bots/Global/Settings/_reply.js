let prefix = `${client.guilds.cache.get(global.sistem.SERVER.ID).emojiGöster(emojiler.Iptal)}`

module.exports = {
    prefix,
    noyt:          `Bu komutu kullanabilmek için herhangi bir yetkiye sahip değilsin. ${prefix}`,
    bot:           `Belirtilen kullanıcı bot olduğu için işlem iptal edildi. ${prefix}`,
    üye:           `Lütfen bir kullanıcı etiketleyin veya ID'sini giriniz. ${prefix}`,
    süre:          `İşleme devam edebilmeniz için bir süre belirtiniz. ${prefix}`,
    sebep:         `İşleme devam edebilmeniz için bir sebep belirtiniz. ${prefix}`,
    yetkiust:      `İşlem yapmaya çalıştığın kulanıcı senle aynı yetkide veya senden üstün. ${prefix}`,
    dokunulmaz:    `Bot'un erişimi olmadığı için işleme devam edilemiyor. ${prefix}`,
    kayıtlı:       `Belirtiğiniz kullanıcı zaten kayıtlı olduğu için işleme devam edilemiyor. ${prefix}`,
    kayıtsız:      `Kayıtsız kullanıcıyı tekrardan kayıtsıza atamazsınız. ${prefix}`,
    kendi:         `Kendi üzerine işlem uygulayamazsın. ${prefix}`,
    bulunamadi:    `Belirttiğiniz ID sunucu veya da sistem içerisinde bulunamadı. ${prefix}`,
    üyeyok:        `Belirtilen kullanıcı sunucu içerisinde veya sistem içerisinde bulunamadı. ${prefix}`,
    yenihesap:     `Belirtilen kullanıcı bir haftadan önce hesabı kurulduğu için işleme devam edilemiyor. ${prefix}`,
    cezaliuye:     `Belirtilen kullanıcı cezalı olduğu için işleme devam edilemiyor. ${prefix}`,
    yetersizyaş:   `Belirtilen kullanıcının yaşı ${ayarlar ? ayarlar.minYaş : 0}'den küçük olduğu için kayıt işlemi yapılamıyor. ${prefix}`,
    argümandoldur: `Belirtilen argümanlar geçersiz olduğu için devam edilemiyor. ${prefix}`,
    taglıalım:     `Belirtilen kullanıcının isminde **${ayarlar.tag}** bulunmadığından işleme devam edilemiyor. ${prefix}`, 
    isimapi:       `Belirtilen isim 32 karakterden uzun olduğu için işleme devam edilemiyor. ${prefix}`,
    cezavar:       `Belirtilen kullanıcının aktif bir cezalandırılması bulunduğundan işlem yapılamaz. ${prefix}`,
    cezayok:       `Belirtilen kullanıcının aktif bir cezası bulunamadı. ${prefix}`,
    yetkilinoban:  `Belirtilen kullanıcı yetkili olduğundan işlem yapılamıyor. ${prefix}`,
    yasaklamayok:  `Sunucuda herhangi bir yasaklama bulunamadı. ${prefix}`,
    ayarlamayok:    `Belirtilen komutun ayarları yapılmadığından dolayı işlem iptal edildi. Sistem yöneticisine başvurun! ${prefix}`,
    notSetup: `Lütfen kullanılan komut ayarlarını tamamlayın. \`${global.sistem.botSettings.Prefixs[0]}setup\` komutundan kurulumunu yapınız. ${prefix}`,
    data: `Belirtilen kullanıcının geçmişi bulunamadı. ${prefix}`,
    bokyolu: `Kullanım hakkınız dolduğu için işleminiz iptal edildi. ${prefix}` //wc lafügüsex hatırası

}