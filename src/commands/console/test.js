const {log} = require('../../logger.ts');

function test() {
    log.verbose('test successful');
}

function help() {
    log.verbose('test');
    log.verbose('    Tests whether the bot is on.');
}

module.exports = {test, help}