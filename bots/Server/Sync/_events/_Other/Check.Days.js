const TimeManager = require("../../../../Global/Plugins/Stats/Time.Manager");

module.exports = async () => {
    const tm = TimeManager;
    await tm.checkDay(global.sistem.SERVER.ID);
    setInterval(async () => {
        await tm.checkDay(global.sistem.SERVER.ID);
    }, 5000);
}

module.exports.config = {
    Event: "ready"
}