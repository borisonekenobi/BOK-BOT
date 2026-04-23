import 'dotenv/config';

import {bot} from './bot.js';
import {log} from './logger.js';

import {ready, shutdown} from './util.js';
import {interaction} from './events/interaction.js';
import {guildMemberAdd, guildMemberRemove} from './events/guild-member.js';
import {messageCreate, messageDelete, messageUpdate} from './events/message.js';

// import consoleInput from './commands/console/input.js';

const TOKEN = process.env['TOKEN'];
if (!TOKEN) {
	log.error('Missing TOKEN from .env file');
	process.exit(1);
}

// const consoleListener = process.openStdin();
// consoleListener.addListener('data', res => {
// 	try {
// 		consoleInput.input(bot, res);
// 	} catch (err) {
// 		log.error(err);
// 	}
// });

await bot.login(TOKEN);

bot.on('clientReady', ready);

bot.on('interactionCreate', interaction);

bot.on('guildMemberAdd', guildMemberAdd);
bot.on('guildMemberRemove', guildMemberRemove);

bot.on('messageCreate', messageCreate);
bot.on('messageUpdate', messageUpdate);
bot.on('messageDelete', messageDelete);

process.on('SIGINT', shutdown);
