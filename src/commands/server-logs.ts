import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	TextChannel,
} from 'discord.js';

import {createServer, getServerById} from '../db/servers.js';
import {
	createServerLogChannel,
	deleteServerLogChannel,
	getServerLogChannelById,
	updateServerLogChannel,
} from '../db/server-log-channels.js';
import {createChannel, getChannelById} from '../db/channels.js';
import {createEmbed} from '../util.js';
import {serverHasChannel} from '../db/dbLogs.js';

export async function logs(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	let subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case 'setup':
			return await setup(interaction, guild);

		case 'disable':
			return await disable(guild);
	}

	throw new Error('Unknown subcommand');
}

async function setup(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	let textChannel = interaction.options.getChannel('channel', true);
	if (!(textChannel instanceof TextChannel)) {
		return createEmbed({
			color: 'Red',
			title: 'Error!',
			description: 'Selected channel must be a text channel!',
		});
	}

	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let channel = await getChannelById(textChannel.id) ??
		await createChannel(textChannel.id);
	if (!channel) throw new Error('Could not find or create a channel');

	let server_log_channel = await getServerLogChannelById(server.id) ??
		await createServerLogChannel(server.id, channel.id);
	if (!server_log_channel) throw new Error(
		'Could not find or create a server log channel');

	await updateServerLogChannel(server.id, channel.id);

	let discord_channel = guild.channels.cache.find(
		channel => channel.id === textChannel.id);
	return createEmbed({
		color: 'Green',
		description: `The ${discord_channel?.toString()} channel will now be used for logs`,
	});
}

async function disable(guild: Guild): Promise<EmbedBuilder> {
	if (!await serverHasChannel(guild)) {
		return createEmbed({
			color: 'DarkGold',
			title: 'Warning!',
			description: 'No logs channel is setup yet!',
		});
	}

	let server = await getServerById(guild.id);
	if (server === null) return createEmbed({
		color: 'DarkGold',
		title: 'Warning!',
		description: 'No logs channel is setup yet!',
	});
	if (server === undefined) throw new Error('Could not find a server');

	await deleteServerLogChannel(server.id);
	return createEmbed({
		color: 'Green',
		description: 'The logs channel has been removed. Logs will no longer be kept',
	});
}
