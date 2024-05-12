const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs().format();
dayjs.extend(duration);

module.exports = class Util {
  constructor() {
  }

  /**
   * Formats time
   * @param {number} time
   * @returns {string}
   */
  static format_time(time) {
    if (!time) return "00:00";
    const format = dayjs.duration(time).format("DD:HH:mm:ss");
    const chunks = format.split(":").filter(c => c !== "00");

    if (chunks.length < 2) chunks.unshift("00");

    return chunks.join(":");
  }
}