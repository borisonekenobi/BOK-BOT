const dbClient = require("./dbClient");
const dbUtil = require("./dbUtil");

async function serverHasChannel(guildID) {
    let hasChannel = false;

    const client = await dbClient.getClient();
    await (async () => {
        let server = await dbUtil.getServerByID(guildID, client);
        hasChannel = await dbUtil.getServerLogChannelByID(server.id, client);
    })();
    await client.end();

    return hasChannel !== false;
}

module.exports = {
    serverHasChannel
}