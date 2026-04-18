function version() {
    const p = require('../../package.json');
    console.log(p.version);
}

function help() {
    console.log('version');
    console.log('    Displays current bot version.');
}

module.exports = {version, help}