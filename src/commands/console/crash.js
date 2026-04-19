const {log} = require('../../logger.ts')

function crash(E = 'Unknown error') {
    throw E;
}

function help() {
    log.verbose('crash [E]');
    log.verbose('    Will throw an error E. If E is not given, \'Unknown error\' will be thrown');
}

module.exports = {crash, help}