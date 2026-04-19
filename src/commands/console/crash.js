const {log} = require('../../logger.ts')

function crash(E = 'Unknown error') {
    throw E;
}

function help() {
    log.info('crash [E]');
    log.info('    Will throw an error E. If E is not given, \'Unknown error\' will be thrown');
}

module.exports = {crash, help}