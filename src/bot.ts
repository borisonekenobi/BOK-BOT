import {Client, GatewayIntentBits} from 'discord.js';

export let bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers],
});
