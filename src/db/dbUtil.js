function dateToSQL(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function getServerByID(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.servers
             WHERE discord_id = $1;`,
            [id]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addServer(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.servers(discord_id)
             VALUES ($1)
             RETURNING id, discord_id;`,
            [id]
        );
    })();

    return res.rows[0];
}

async function getUserByID(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.users
             WHERE discord_id = $1;`,
            [id]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addUser(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.users(discord_id)
             VALUES ($1)
             RETURNING id, discord_id;`,
            [id]
        );
    })();

    return res.rows[0];
}

async function getRoleByID(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.roles
             WHERE discord_id = $1;`,
            [id]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addRole(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.roles(discord_id)
             VALUES ($1)
             RETURNING id, discord_id;`,
            [id]
        );
    })();

    return res.rows[0];
}

async function getServerUserByID(serverID, userID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.server_users
             WHERE user_id = $1 AND server_id = $2;`,
            [userID, serverID]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addServerUser(serverID, userID, date = new Date(1970, 0, 1), client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.server_users(server_id, user_id, level, points, last_earned_point)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING server_id, user_id, level, points, last_earned_point;`,
            [serverID, userID, 0, 0, dateToSQL(date)]
        );
    })();

    return res.rows[0];
}

async function getUserRank(serverID, userID, client) {
    let rank;
    await (async () => {
        let res = await client.query(
            `SELECT bokbot.get_user_rank($1, $2) AS rank;`,
            [serverID, userID]
        );

        rank = res.rows[0].rank;
    })();

    return rank;
}

async function addPointsToUser(serverUser, date, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT bokbot.add_points_to_user($1, $2, $3) AS level`,
            [serverUser.server_id, serverUser.user_id, dateToSQL(date)]
        );
    })();

    return res.rows[0].level;
}

async function getServerRoleByID(serverID, roleID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.server_roles
             WHERE server_id = $1 AND role_id = $2;`,
            [serverID, roleID]
        )
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addServerRole(serverID, roleID, level, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.server_roles(server_id, role_id, level)
             VALUES ($1, $2, $3)
             RETURNING server_id, role_id, level;`,
            [serverID, roleID, level]
        );
    })();

    return res.rows[0];
}

async function updateServerRole(serverRole, client) {
    let res;
    await (async () => {
        res = await client.query(
            `UPDATE bokbot.server_roles
             SET level = $1
             WHERE server_id = $2 AND role_id = $3;`,
            [serverRole.level, serverRole.server_id, serverRole.role_id]
        );
    })();

    return res.rows[0];
}

async function getServerRoles(serverID, minLevel = 0, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT bokbot.server_roles.level,
                    bokbot.roles.discord_id AS id
             FROM bokbot.server_roles
             INNER JOIN bokbot.roles ON bokbot.server_roles.role_id = bokbot.roles.id
             WHERE server_id = $1 AND bokbot.server_roles.level >= $2
             ORDER BY level ASC;`,
            [serverID, minLevel]
        );
    })();

    return res.rows;
}

async function removeServerRole(serverRole, client) {
    await (async () => {
        await client.query(
            `DELETE FROM bokbot.server_roles
             WHERE server_id = $1 AND role_id = $2;`,
            [serverRole.server_id, serverRole.role_id]
        );
    })();
}

async function getServerUsers(serverID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT bokbot.server_users.*,
                    bokbot.users.discord_id AS id
             FROM bokbot.server_users
             INNER JOIN bokbot.users ON bokbot.server_users.user_id = bokbot.users.id
             WHERE server_id = $1;`,
            [serverID]
        );
    })();

    return res.rows;
}

async function getServerBotRoles(serverID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.server_bot_roles
             WHERE server_id = $1;`,
            [serverID]
        );
    })();

    return res.rows;
}

async function getChannel(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.channels
             WHERE id = $1;`,
            [id]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function getChannelByID(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.channels
             WHERE discord_id = $1;`,
            [id]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addChannel(id, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.channels(discord_id)
             VALUES ($1)
             RETURNING id, discord_id;`,
            [id]
        );
    })();

    return res.rows[0];
}

async function getServerLogChannelByID(serverID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT *
             FROM bokbot.server_log_channels
             WHERE server_id = $1;`,
            [serverID]
        );
    })();

    return res.rows.length === 0 ? false : res.rows[0];
}

async function addServerLogChannel(serverID, channelID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `INSERT INTO bokbot.server_log_channels(server_id, channel_id)
             VALUES ($1, $2)
             RETURNING server_id, channel_id;`,
            [serverID, channelID]
        );
    })();

    return res.rows[0];
}

async function setServerLogChannel(serverID, channelID, client) {
    let res;
    await (async () => {
        res = await client.query(
            `UPDATE bokbot.server_log_channels
             SET channel_id = $1
             WHERE server_id = $2;`,
            [channelID, serverID]
        );
    })();

    return res.rows[0];
}

async function removeServerLogChannel(serverID, client) {
    await (async () => {
        await client.query(
            `DELETE FROM bokbot.server_log_channels
             WHERE server_id = $1;`,
            [serverID]
        );
    })();
}

async function getPointsForLevel(level, client) {
    let res;
    await (async () => {
        res = await client.query(
            `SELECT bokbot.points_for_level($1) AS points;`,
            [level]
        );
    })();

    return res.rows[0].points;
}

module.exports = {
    getServerByID,
    addServer,
    getUserByID,
    addUser,
    getRoleByID,
    addRole,
    getServerUserByID,
    addServerUser,
    getUserRank,
    addPointsToUser,
    getServerRoleByID,
    addServerRole,
    updateServerRole,
    getServerRoles,
    removeServerRole,
    getServerUsers,
    getServerBotRoles,
    getChannel,
    getChannelByID,
    addChannel,
    getServerLogChannelByID,
    addServerLogChannel,
    setServerLogChannel,
    removeServerLogChannel,
    getPointsForLevel
}
