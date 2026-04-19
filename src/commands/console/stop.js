const {log} = require('../../logger.ts');

function stop(bot) {
    log.info('Stopping');
    bot.channels.cache.get('738439111412809730').send(':red_circle: Bot has stopped.')
        .then(r => log.info(`Sent message: \n\t${r.content.replace(/\r?\n|\r/g, '\n\t')}`))
        .then(() => process.exit(0))
        .catch(console.error);
}

function help() {
    log.warning('Currently being worked on');
}

module.exports = {stop, help}