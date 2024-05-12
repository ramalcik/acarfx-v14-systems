const { createCanvas, loadImage, Image } = require('canvas');
const Util = require('./Util');

module.exports = class Spotify {
  constructor() {
    this.album = null;
    this.artist = null;
    this.background = {
      type: "color",
      background: "#23272a",
    };
    this.bar = {
      background_color: "#e8e8e8",
      color: "#1db954"
    };
    this._bar_width = 300;
    this.end = null;
    this.foreground = {
      color: "#2a2e35",
      opacity: 0.8
    };
    this.image = null;
    this.title = null;
    this.start = null;
  }

  /**
   * Set album name
   * @param {string} name Album name
   * @returns {Spotify}
   */
  setAlbum(name) {
    if (!name || typeof name !== "string") throw new Error("The argument of the setAlbum method must be a string.");
    this.album = name;
    return this;
  }

  /**
   * Set artist name
   * @param {string} name Artist name
   * @returns {Spotify}
   */
  setAuthor(name) {
    if (!name || typeof name !== "string") throw new Error("The argument of the setAuthor method must be a string.");
    this.artist = name;
    return this;
  }

  /**
   * Set background color/image
   * @param {string} type Type between 'color' and 'image'
   * @param {string|Buffer|Image} value Image or color
   * @returns {Spotify}
   */
  setBackground(type, value) {
    if (type === 'color' && typeof value === "string") {
      if (value) {
        if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)) {
          this.background.type = "color";
          this.background.background = value;
          return this;
        } else {
          throw new Error("Invalid color for the second argument in setBackground method. You must give a hexadecimal color.");
        }
      } else {
        throw new Error("You must give a hexadecimal color as a second argument of setBackground method.");
      }
    } else if (type === 'image') {
      if (value) {
        this.background.type = "image";
        this.background.background = value;
        return this;
      } else {
        throw new Error("You must give a background URL as a second argument.");
      }
    } else {
      throw new Error("The first argument of setBackground must be 'color' or 'image'.");
    }
  }

  /**
   * Set progressbar color
   * @param {string} color Color
   * @returns {Spotify}
   */
   setBarBackgroundColor(color) {
    if (color) {
      if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
        this.bar.background_color = color;
        return this;
      } else {
        throw "The argument of setBarBackgroundColor method must be a hexadecimal color."
      }
    }
  }

  /**
   * Set progressbar color
   * @param {string} color Color
   * @returns {Spotify}
   */
  setBarColor(color) {
    if (color) {
      if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
        this.bar.color = color;
        return this;
      } else {
        throw "The argument of setBarColor method must be a hexadecimal color."
      }
    }
  }

  /**
   * Set foreground color
   * @param {string} color Color
   * @returns {Spotify}
   */
  setForegroundColor(color) {
    if (color) {
      if (/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) {
        this.foreground.color = color;
        return this;
      } else {
        throw "The argument of setForegroundColor method must be a hexadecimal color."
      }
    }
  }

  /**
   * Set foreground opacity
   * @param {number} opacity Opacity
   * @returns {Spotify}
   */
  setForegroundOpacity(opacity = 0.8) {
    if (opacity) {
      if (opacity >= 0 && opacity <= 1) {
        this.foreground.opacity = opacity;
        return this;
      } else {
        throw new Error("The value of the opacity of setForegroundOpacity method must be between 0 and 1 (0 and 1 included).");
      }
    }
  }

  /**
   * Set image
   * @param {string|Buffer|Image} image Image
   * @returns {Spotify}
   */
  setImage(image) {
    if (!image) throw new Error("The argument of the setAuthor method must be a string or a Buffer or a Canvas.Image.");
    this.image = image;
    return this;
  }

  /**
   * Set title
   * @param {string} title Title to set
   * @returns {Spotify}
   */
  setTitle(title) {
    if (!title || typeof title !== "string") throw new Error("The argument of the setTitle method must be a string.");
    this.title = title;
    return this;
  }

  /**
   * Set start and end timestamp
   * @param {number} start Start timestamp
   * @param {number} end End timestamp
   * @returns {Spotify}
   */
  setTimestamp(start, end) {
    if (!start || typeof start !== "number") throw new Error("The first argument of the setTimestamp method must be a number.");
    if (!end || typeof end !== "number") throw new Error("The first argument of the setTimestamp method must be a number.");
    this.start = start;
    this.end = end;
    return this;
  }

  _calcule_progress(current, total) {
    const progress = (current / total) * this._bar_width;
    if (isNaN(progress) || current < 0) {
      return 0;
    } else if (progress > this._bar_width) {
      return this._bar_width;
    } else {
      return progress;
    }
  }

  async build() {
    if (!this.title) throw new Error('Missing "title" parameter.');
    if (!this.artist) throw new Error('Missing "artist" parameter.');
    if (!this.start) throw new Error('Missing "start" parameter.');
    if (!this.end) throw new Error('Missing "end" parameter.');

    const start_format = Util.format_time(this.start > this.end ? this.end : this.start);
    const end_format = Util.format_time(this.end);

    const canvas = createCanvas(600, 150);
    const ctx = canvas.getContext("2d");

    if (this.background.type === "color") {
      ctx.beginPath();
      ctx.fillStyle = this.background.background || "#2F3136";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.closePath();
    } else {
      try {;
        ctx.drawImage(await loadImage(this.background.background), 0, 0, canvas.width, canvas.height);
      } catch {
        throw new Error("The image given in the second parameter of the setBackground method is not valid or you are not connected to the internet.");
      }
    }

    ctx.globalAlpha = this.foreground.opacity;
    ctx.beginPath();
    ctx.fillStyle = this.foreground.color || "#2F3136";
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.closePath();

    ctx.globalAlpha = 1;

    ctx.save();

    ctx.beginPath();
    ctx.arc(90, 75, 75, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    try {
      ctx.drawImage(await loadImage(this.image), 30, 15, 120, 120);
    } catch {
      throw new Error("The image given in the second parameter of the setBackground method is not valid or you are not connected to the internet.");
    }

    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Manrope";
    ctx.fillText(this.title.slice(0, 30), 170, 45);

    ctx.fillStyle = "#f1f1f1";
    ctx.font = "regular 14px Manrope";
    ctx.fillText(`by ${this.artist.slice(0, 40)}`, 170, 70);

    if (this.album && typeof this.album === "string") {
      ctx.fillStyle = "#f1f1f1";
      ctx.font = "regular 14px Manrope";
      ctx.fillText(`on ${this.album.slice(0, 40)}`, 170, 90);
    }

    ctx.fillStyle = "#B3B3B3";
    ctx.font = "regular 14px Manrope"
    ctx.fillText(end_format, 430, 130);

    ctx.fillStyle = "#b3b3b3";
    ctx.font = "regular 14px Manrope";
    ctx.fillText(start_format, 170, 130);

    ctx.rect(170, 170, this._bar_width, 4);
    ctx.fillStyle = this.bar.background_color ||  "#E8E8E8";
    ctx.fillRect(170, 110, this._bar_width, 4);

    ctx.fillStyle = this.bar.color || "#1DB954";
    ctx.fillRect(170, 110, this._calcule_progress(this.start, this.end), 4);

    return canvas;
  }
}