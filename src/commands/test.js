const util = require("../util");

function execute() {
    return util.createEmbed('#00FF00', 'Test Successful!', '', '', '', '', 'Test Successful!');
}

module.exports = {
    execute
}