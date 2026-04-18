const util = require("../util");
const types = require("../types");
const dbUtil = require("../db/dbUtil");
const dbClient = require('../db/dbClient')
const dbLogs = require('../db/dbLogs')

async function log(type, guild, arg1, arg2 = undefined) {
    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) await dbUtil.addServer(guild.id, client);

    let server_log_channel = await dbUtil.getServerLogChannelByID(server.id, client);
    if (!server_log_channel) return;

    let channel = await dbUtil.getChannel(server_log_channel.channel_id, client);
    if (!channel) channel = await dbUtil.addChannel(server_log_channel.channel_id, client);

    if (type === types.EDITED) arg1.link = `https://discord.com/channels/${arg1.guildId}/${arg1.channelId}/${arg1.id}`
    if (arg1.content === '') arg1.content = `**${arg1.embeds[0].title}\n${arg1.embeds[0].description}**`;
    guild.channels.cache.get(channel.discord_id).send({embeds: [responseBuilder(type, arg1, arg2)]});
}

function responseBuilder(type, arg1, arg2) {
    switch (type) {
        case types.EDITED:
            return util.createEmbed('#AB9713', '', '', '', '', '', `Message edited by <@${arg1.author.id}> in <#${arg1.channel.id}>:`, '', [
                {name: 'Before:', value: arg1.content},
                {name: 'After:', value: arg2.content},
                {name: 'Message Link:', value: arg1.link},
            ]);

        case types.DELETED:
            return util.createEmbed('#AB1327', '', '', '', '', '', `Message sent by <@${arg1.author.id}> deleted in <#${arg1.channel.id}>:`, '', [
                {name: 'Original Message:', value: arg1.content}
            ]);

        case types.JOINED:
            return util.createEmbed('#37D893', 'Member Joined:', '', '', '', '', `<@${arg1.user.id}> ${arg1.user.username}`);

        case types.LEFT:
            return util.createEmbed('#D9367D', 'Member Left:', '', '', '', '', `<@${arg1.user.id}> ${arg1.user.username}`);
    }
}

async function execute(interaction, guild) {
    let name = interaction.data.options[0].name
    switch (name) {
        case 'setup':
            return await setup(interaction, guild);

        case 'disable':
            return await disable(guild);
    }
}

async function setup(interaction, guild) {
    let channelID = interaction.data.options[0].options[0].value;

    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) server = await dbUtil.addServer(guild.id, client);

    let channel = await dbUtil.getChannelByID(channelID, client);
    if (!channel) channel = await dbUtil.addChannel(channelID, client);

    let server_log_channel = await dbUtil.getServerLogChannelByID(server.id, client);
    if (!server_log_channel) await dbUtil.addServerLogChannel(server.id, channel.id, client);
    else await dbUtil.setServerLogChannel(server.id, channel.id, client);

    let discord_channel = guild.channels.cache.find(channel => channel.id === channelID);
    return util.createEmbed('#00FF00', '', '', '', '', '', `The ${discord_channel.toString()} channel will now be used for logs`);
}

async function disable(guild) {
    if (!await dbLogs.serverHasChannel(guild.id)) {
        return util.createEmbed('#F9A825', '', '', 'Warning!', '', '', 'No logs channel is setup yet!');
    }

    const client = await dbClient.getClient();

    let server = await dbUtil.getServerByID(guild.id, client);
    if (!server) server = await dbUtil.addServer(guild.id, client);

    await dbUtil.removeServerLogChannel(server.id, client);
    return util.createEmbed('#00FF00', '', '', '', '', '', 'The logs channel has been removed. Logs will no longer be kept');
}

module.exports = {
    log, execute
}
