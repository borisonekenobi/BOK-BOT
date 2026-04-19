const {log} = require('../../logger.ts');

function version() {
    const p = require('../../../package.json');
    log.info(p.version);
}

function help() {
    log.info('version');
    log.info('    Displays current bot version.');
}

module.exports = {version, help}