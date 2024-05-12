const {EmbedBuilder, resolveColor, verifyString} = require('discord.js')

class genEmbed extends EmbedBuilder {
    constructor(opt) {
        super(opt)
            this.setColor("Random")
    }
  /* 
  * Dünyanın en saçma embedi
  */
  başlık(title) {
      this.title = verifyString(title, RangeError, 'EMBED_TITLE');
      return this;
  }
  üstBaşlık(options, deprecatedIconURL, deprecatedURL) {
    if (options === null) {
      this.author = {};
      return this;
    }

    if (typeof options === 'string') {
      options = { name: options, url: deprecatedURL, iconURL: deprecatedIconURL };
    }

    const { name, url, iconURL } = options;
    this.author = { name: verifyString(name, RangeError, 'EMBED_AUTHOR_NAME'), url, iconURL };
    return this;
  }

  renk(color) {
    this.color = resolveColor(color);
    return this;
  }

  açıklama(description) {
    this.description = verifyString(description, RangeError, 'EMBED_DESCRIPTION');
    return this;
  }
  sütun(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  altBaşlık(options, deprecatedIconURL) {
    if (options === null) {
      this.footer = {};
      return this;
    }

    if (typeof options === 'string') {
      options = { text: options, iconURL: deprecatedIconURL };
    }

    const { text, iconURL } = options;
    this.footer = { text: verifyString(text, RangeError, 'EMBED_FOOTER_TEXT'), iconURL };
    return this;

    }
}

module.exports = { genEmbed }
