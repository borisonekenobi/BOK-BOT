const {log} = require('../../logger.ts');
const util = require('../../util.ts');

const Discord = require('discord.js');
const TOKEN = process.env.TOKEN;

function restart(bot) {
    bot.channels.cache.get('738439111412809730').send(':yellow_circle: Bot is restarting.')
        .then(r => log.info(`Sent message: \n\t${r.content.replace(/\r?\n|\r/g, '\n\t')}`))
        .then(() => reboot(bot))
        .catch(console.error);
}

function help() {
    log.info('restart|reboot');
    log.info('    Restarts the bot.');
}

function reboot(bot) {
    bot.destroy();
    bot = new Discord.Client();
    bot.login(TOKEN).then(r => log.info('Used token: ' + r));
    bot.on('ready', () => {
        util.ready(bot)
    });
}

module.exports = {restart, help}