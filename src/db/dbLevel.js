const dbClient = require('./dbClient');
const dbUtil = require('./dbUtil');
const db = require("./dbUtil");

async function updateUser(serverID, userID, date) {
    let levelIncreased = false;

    const client = await dbClient.getClient();
    await (async () => {
        console.log(serverID, userID, date);
        let server = await dbUtil.getServerByID(serverID, client);
        console.log(server);
        if (!server) server = await dbUtil.addServer(serverID, client);

        let user = await dbUtil.getUserByID(userID, client);
        if (!user) user = await dbUtil.addUser(userID, client);

        let server_user = await dbUtil.getServerUserByID(server.id, user.id, client);
        if (!server_user) server_user = await dbUtil.addServerUser(server.id, user.id, date, client);

        const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        const utcLastPoint = Date.UTC(server_user.last_earned_point.getFullYear(), server_user.last_earned_point.getMonth(), server_user.last_earned_point.getDate(), server_user.last_earned_point.getHours(), server_user.last_earned_point.getMinutes(), server_user.last_earned_point.getSeconds(), server_user.last_earned_point.getUTCMilliseconds());
        const diffTimeMS = Math.abs(utcDate - utcLastPoint);
        let level = server_user.level;
        if (diffTimeMS >= 60 * 1000) level = await dbUtil.addPointsToUser(server_user, date, client);

        levelIncreased = level - server_user.level > 0 ? level : false;
    })();
    await client.end();

    return levelIncreased;
}

async function getUser(serverID, userID) {
    let server_user = false;

    const client = await dbClient.getClient();
    await (async () => {
        let server = await dbUtil.getServerByID(serverID, client);
        if (!server) server = await dbUtil.addServer(serverID, client);

        let user = await dbUtil.getUserByID(userID, client);
        if (!user) user = await dbUtil.addUser(userID, client);

        server_user = await dbUtil.getServerUserByID(server.id, user.id, client);
        if (!server_user) server_user = await dbUtil.addServerUser(server.id, user.id, undefined, client);

        server_user.rank = await dbUtil.getUserRank(server.id, user.id, client);
    })();
    await client.end();

    return server_user;
}

async function getPointsForLevel(level) {
    let points_for_level = NaN;

    const client = await dbClient.getClient();
    await (async () => {
        points_for_level = await db.getPointsForLevel(level, client);
    })();
    await client.end();

    return points_for_level;
}

module.exports = {
    updateUser,
    getUser,
    getPointsForLevel
}
