const util = require('../util');
const dbClient = require("../db/dbClient");
const dbUtil = require("../db/dbUtil");

async function execute(guild, member) {
    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) server = await dbUtil.addServer(guild.id, client);

    let server_bot_roles = await dbUtil.getServerBotRoles(server.id, client);

    await client.end();

    for (const server_bot_role of server_bot_roles) {
        const role = guild.roles.cache.find(role => role.id === server_bot_role.id);
        util.giveRole(member, role, role.id);
    }
}

module.exports = {
    execute
}
