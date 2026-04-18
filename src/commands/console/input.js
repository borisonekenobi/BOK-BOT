const ct = require('./test.js');
const cr = require('./restart.js');
const cs = require('./stop.js');
const cv = require('./version');
const cp = require('./pull.js');
const ch = require('./help.js');
const cc = require('./crash.js');

function input(bot, res) {
    const consoleMsg = res.toString().toLocaleLowerCase().trim().split(/ +/g).join(' ');
    if (consoleMsg === 'test') {
        ct.test();

    } else if (consoleMsg === 'restart' || consoleMsg === 'reboot') {
        cr.restart(bot);

    } else if (consoleMsg === 'stop') {
        cs.stop(bot);

    } else if (consoleMsg === 'version') {
        cv.version();

    } else if (consoleMsg === 'pull code' || consoleMsg === 'pull') {
        cp.pull();

    } else if (consoleMsg.startsWith('help')) {
        ch.help(consoleMsg);

    } else if (consoleMsg.startsWith('crash')) {
        if (consoleMsg === 'crash') {
            cc.crash();
        } else {
            let errorMsg = consoleMsg.substr(consoleMsg.indexOf(" ") + 1);
            cc.crash(errorMsg);
        }

    } else {
        console.log(consoleMsg + ': command not found')
        console.log('Use \'help --all\' for help.')

    }
}

module.exports = {input}