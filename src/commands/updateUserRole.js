const dbClient = require('../db/dbClient');
const dbUtil = require('../db/dbUtil');
const util = require('../util')

async function execute(guild, member, level) {
    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) server = await dbUtil.addServer(guild.id, client);

    const server_roles = await dbUtil.getServerRoles(server.id, level, client);
    await client.end();

    for (const server_role of server_roles) {
        const role = guild.roles.cache.find(role => role.id === server_role.id);
        util.giveRole(member, role, role.id);
    }
}

module.exports = {
    execute
}
