require('dotenv').config();
const {Client, Intents, MessagePayload} = require('discord.js');
let bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});
const TOKEN = process.env.TOKEN;

const util = require('./util.js');
const db = require('./db/dbLevel.js')
const newMember = require('./commands/newMember.js');
const newBotMember = require('./commands/newBotMember.js');
const updateUserRole = require('./commands/updateUserRole.js');
const consoleInput = require('./commands/console/input.js');

const level = require('./commands/level.js');
const logs = require('./commands/serverLogs.js');
const buttonRole = require('./commands/buttonRole.js');
const role = require('./commands/role.js');
const startScore = require('./commands/startScore.js');
const test = require('./commands/test.js');

bot.login(TOKEN).then(r => console.log('Used token: ' + r));

bot.on('ready', () => {
    util.ready(bot);
});

const consoleListener = process.openStdin();
consoleListener.addListener('data', res => {
    try {
        consoleInput.input(bot, res)
    } catch (err) {
        util.createLog(err);
    }
});

const interactionTypes = require('./interactionTypes');

bot.ws.on('INTERACTION_CREATE', async (interaction) => {
    try {
        //console.log(interaction)
        let type = interaction.type;
        let guildID = interaction.guild_id;
        let guild = bot.guilds.cache.get(guildID);
        let authorID = interaction.member.user.id;
        let author = await guild.members.fetch(authorID);
        //console.log(author);
        let name = interaction.data.name;
        let content = 'An error occurred and a response could not be generated';
        let hasReplied = false;
        console.log(`Interaction type ${type} used by ${authorID} in guild ${guildID} in channel ${interaction.channel_id}`);
        //console.log(interaction);

        switch (type) {
            case interactionTypes.PING:
                console.log('type == 1');
                console.log(interaction);
                break;

            case interactionTypes.APPLICATION_COMMAND:
                switch (name) {
                    case 'level':
                        let memberID = interaction.data.options === undefined ? false : interaction.data.options[0].value;
                        let member = false;
                        if (memberID) member = await guild.members.fetch(memberID);

                        if (!member || memberID === authorID)
                            content = await level.execute(guildID, author);
                        else if (member.user.bot)
                            content = await level.infinite();
                        else
                            content = await level.execute(guildID, member, true);
                        break;

                    case 'logs':
                        content = await logs.execute(interaction, guild);
                        break;

                    case 'buttonrole':
                        let message = buttonRole.execute(interaction, guild);
                        let msg = message.content;
                        let components = message.components;
                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4, data: {
                                    content: msg, components: components
                                }
                            }
                        });
                        return;

                    case 'role':
                        content = await role.execute(interaction, guild);
                        break;

                    case 'startscore':
                        await reply(interaction, util.createEmbed('#FFFF00', '', '', '', '', '', 'Scoring members...'));
                        hasReplied = true;
                        const channel = await bot.channels.fetch(interaction.channel_id);
                        await channel.send({embeds: [await startScore.execute(guild)]});
                        break;

                    case 'test':
                        content = test.execute();
                }
                break;

            case interactionTypes.MESSAGE_COMPONENT:
                buttonRole.buttonClicked(interaction, author, guild);
                content = undefined;
                bot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 6
                    }
                }).catch(reason => {
                    console.log(reason)
                })
                return;

            case interactionTypes.APPLICATION_COMMAND_AUTOCOMPLETE:
                console.log('type == 4');
                console.log(interaction);
                break;

            case interactionTypes.MODAL_SUBMIT:
                console.log('type == 5');
                console.log(interaction);
                break;

            default:
                console.error(`Unknown interaction type: ${interaction.type}`);
                throw new Error('Unknown interaction type: ${interaction.type}');
        }

        if (!hasReplied)
            await reply(interaction, content);

    } catch (err) {
        util.createLog(err);
    }
});

const reply = async (interaction, response) => {
    let data
    if (typeof response === 'object') {
        data = {
            embeds: [response]
        };
    } else {
        data = {
            content: response
        };
    }

    bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4, data
        }
    });
};

bot.on('guildMemberAdd', async member => {
    try {
        const guild = member.guild;
        const guildID = guild.id;
        console.log(`${member.id} joined ${guildID}`);

        await logs.log(types.JOINED, guild, member);

        switch (member.user.bot) {
            case true:
                await newBotMember.execute(guild, member);
                break;
            case false:
                await newMember.execute(guild, member, member.joinedAt);
                break;
            default:
                console.log('member\'s user.bot is neither true nor false, no roles given');
        }
    } catch (err) {
        util.createLog(err);
    }
});

bot.on('messageCreate', async msg => {
    try {
        if (msg.author.bot) return;

        const guildID = msg.guild.id;
        const guild = bot.guilds.cache.get(guildID);
        const memberID = msg.author.id;
        const member = await guild.members.fetch(memberID);

        let levelIncreased = await db.updateUser(msg.guild.id, msg.author.id, msg.createdAt);
        if (!levelIncreased) return;

        await updateUserRole.execute(guild, member, levelIncreased);
        msg.channel.send(`GG <@${msg.author.id}>, you just advanced to level ${levelIncreased}!`)
    } catch (err) {
        util.createLog(err);
        msg.channel.send('An error occurred!');
    }
});

const types = require('./types.js')

bot.on('messageUpdate', async (oldMessage, newMessage) => {
    try {
        console.log(`${oldMessage.author.id} edited message in guild ${oldMessage.channel.guild.id} in channel ${oldMessage.channel.id}`);
        await logs.log(types.EDITED, oldMessage.channel.guild, oldMessage, newMessage);
    } catch (err) {
        util.createLog(err);
        oldMessage.channel.send('An error occurred!');
    }
});

bot.on("messageDelete", async (deleteMessage) => {
    try {
        console.log(`${deleteMessage.author.id} deleted message in guild ${deleteMessage.channel.guild.id} in channel ${deleteMessage.channel.id}`);
        await logs.log(types.DELETED, deleteMessage.channel.guild, deleteMessage);
    } catch (err) {
        util.createLog(err);
        deleteMessage.channel.send('An error occurred!');
    }
});

bot.on('guildMemberRemove', async member => {
    try {
        console.log(`${member.id} left ${member.guild.id}`);
        await logs.log(types.LEFT, member.guild, member);
    } catch (err) {
        util.createLog(err);
    }
});
