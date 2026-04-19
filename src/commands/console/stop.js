const {log} = require('../../logger.ts');

function stop(bot) {
    log.verbose('Stopping');
    bot.channels.cache.get('738439111412809730').send(':red_circle: Bot has stopped.')
        .then(r => log.verbose(`Sent message: \n\t${r.content.replace(/\r?\n|\r/g, '\n\t')}`))
        .then(() => process.exit(0))
        .catch(console.error);
}

function help() {
    log.warn('Currently being worked on');
}

module.exports = {stop, help}