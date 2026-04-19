const {log} = require('../../logger.ts');

function test() {
    log.info('test successful');
}

function help() {
    log.info('test');
    log.info('    Tests whether the bot is on.');
}

module.exports = {test, help}