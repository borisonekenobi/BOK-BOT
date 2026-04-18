const dbClient = require("../db/dbClient");
const dbUtil = require("../db/dbUtil");
const util = require("../util");

async function execute(guild, member, date) {
    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) server = await dbUtil.addServer(guild.id, client);

    let user = await dbUtil.getUserByID(member.id, client);
    if (!user) user = await dbUtil.addUser(member.id, client);

    let server_user = await dbUtil.getServerUserByID(server.id, user.id, client);
    if (!server_user) server_user = await dbUtil.addServerUser(server.id, user.id, date, client);

    let server_roles = await dbUtil.getServerRoles(server.id, undefined, client);

    await client.end();

    for (const server_role of server_roles) {
        if (server_role.level > user.level) continue;

        const role = guild.roles.cache.find(role => role.id === server_role.id);
        util.giveRole(member, role, role.id);
    }
}

module.exports = {
    execute
}
