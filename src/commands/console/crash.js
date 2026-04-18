function crash(E = 'Unknown error') {
    throw E;
}

function help() {
    console.log('crash [E]');
    console.log('    Will throw an error E. If E is not given, \'Unknown error\' will be thrown');
}

module.exports = {crash, help}