const {log} = require('../../logger.ts')

const ct = require('./test.js');
const cr = require('./restart.js');
const cs = require('./stop.js');
const cv = require('./version');
const cp = require('./pull.js');
const cc = require('./crash.js');

function help(consoleMsg) {
    if (consoleMsg === 'help' || consoleMsg === 'help -a' || consoleMsg === 'help --all') {
        log.verbose('Type \'help --command\' to find out more about the function \'command\'.');
        log.verbose();
        log.verbose(' crash [E]');
        log.verbose(' help [-a]');
        log.verbose(' pull');
        log.verbose(' restart');
        log.verbose(' stop');
        log.verbose(' test');
        log.verbose(' version');
        //TODO: List all commands

    } else if (consoleMsg === 'help --test') {
        ct.help();

    } else if (consoleMsg === 'help --restart') {
        cr.help();

    } else if (consoleMsg === 'help --stop') {
        cs.help();

    } else if (consoleMsg === 'help --version') {
        cv.help();

    } else if (consoleMsg === 'help --pull') {
        cp.help();

    } else if (consoleMsg === 'help --crash') {
        cc.help();

    } else {
        log.verbose(consoleMsg + ': command not found')
        log.verbose('use \'help --all\' for help')
    }
}

module.exports = {help}