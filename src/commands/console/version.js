const {log} = require('../../logger.ts');

function version() {
    const p = require('../../../package.json');
    log.verbose(p.version);
}

function help() {
    log.verbose('version');
    log.verbose('    Displays current bot version.');
}

module.exports = {version, help}