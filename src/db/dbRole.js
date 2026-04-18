const dbClient = require('./dbClient');
const dbUtil = require("./dbUtil");

async function serverHasRole(guildID, roleID) {
    let hasRole = false;

    const client = await dbClient.getClient();
    await (async () => {
        let role = await dbUtil.getRoleByID(roleID, client);
        if (!role) return;

        let server = await dbUtil.getServerByID(guildID, client);
        hasRole = await dbUtil.getServerRoleByID(server.id, role.id, client);
    })();
    await client.end();

    return hasRole !== false;
}

async function addRole(serverID, roleID, roleLevel) {
    const client = await dbClient.getClient();
    await (async () => {
        let server = await dbUtil.getServerByID(serverID, client);
        if (!server) server = await dbUtil.addServer(serverID, client);

        let role = await dbUtil.getRoleByID(roleID, client);
        if (!role) role = await dbUtil.addRole(roleID, client);

        let server_role = await dbUtil.getServerRoleByID(server.id, role.id, client);
        if (!server_role) server_role = await dbUtil.addServerRole(server.id, role.id, roleLevel, client);
    })();
    await client.end();
}

async function editRole(serverID, roleID, roleLevel) {
    const client = await dbClient.getClient();
    await (async () => {
        let server = await dbUtil.getServerByID(serverID, client);
        let role = await dbUtil.getRoleByID(roleID, client);
        let server_role = await dbUtil.getServerRoleByID(server.id, role.id, client);

        server_role.level = roleLevel;

        await dbUtil.updateServerRole(server_role, client);
    })();
    await client.end();
}

async function listRoles(serverID) {
    const client = await dbClient.getClient();

    let roles = [];
    await (async () => {
        let server = await dbUtil.getServerByID(serverID, client);
        if (!server) server = await dbUtil.addServer(serverID, client);

        roles = await dbUtil.getServerRoles(server.id, undefined, client);
    })();
    await client.end();

    return roles;
}

async function removeRole(serverID, roleID) {
    const client = await dbClient.getClient();
    await (async () => {
        let server = await dbUtil.getServerByID(serverID, client);
        let role = await dbUtil.getRoleByID(roleID, client);
        let server_role = await dbUtil.getServerRoleByID(server.id, role.id, client);

        await dbUtil.removeServerRole(server_role, client);
    })();
    await client.end();
}

module.exports = {
    serverHasRole,
    addRole,
    editRole,
    listRoles,
    removeRole
}
