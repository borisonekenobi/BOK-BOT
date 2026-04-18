const ct = require('./test.js');
const cr = require('./restart.js');
const cs = require('./stop.js');
const cv = require('./version');
const cp = require('./pull.js');
const cc = require('./crash.js');

function help(consoleMsg) {
    if (consoleMsg === 'help' || consoleMsg === 'help -a' || consoleMsg === 'help --all') {
        console.log('Type \'help --command\' to find out more about the function \'command\'.');
        console.log();
        console.log(' crash [E]');
        console.log(' help [-a]');
        console.log(' pull');
        console.log(' restart');
        console.log(' stop');
        console.log(' test');
        console.log(' version');
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
        console.log(consoleMsg + ': command not found')
        console.log('use \'help --all\' for help')
    }
}

module.exports = {help}