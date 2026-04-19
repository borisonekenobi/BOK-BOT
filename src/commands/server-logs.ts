import {CommandInteraction, Guild, MessageEmbed, TextChannel} from 'discord.js';

import {createServer, getServerById} from '../db/servers.js';
import {
	createServerLogChannel,
	deleteServerLogChannel,
	getServerLogChannelById,
	updateServerLogChannel,
} from '../db/server-log-channels.js';
import {
	createChannel, getChannelById,
} from '../db/channels.js';
import {createEmbed} from '../util.js';
import {messageType} from '../types.js';
import {serverHasChannel} from '../db/dbLogs.js';

export const server = {
	async log(
		type: messageType, guild: Guild, arg1: any,
		arg2: any = undefined): Promise<void> {

		let server = await getServerById(guild.id) ??
			await createServer(guild.id);
		if (!server) throw new Error('Could not find or create a server');

		let server_log_channel = await getServerLogChannelById(server.id);
		if (server_log_channel === null) return;
		if (server_log_channel === undefined) throw new Error(
			'Could not find server log channel');

		let channel = await getChannelById(server_log_channel.channel_id) ??
			await createChannel(server_log_channel.channel_id);
		if (!channel) throw new Error('Could not find or create a channel');

		if (type === messageType.EDITED) {
			arg1.link = `https://discord.com/channels/${arg1.guildId}/${arg1.channelId}/${arg1.id}`;
		}

		if (arg1.content === '') {
			arg1.content = `**${arg1.embeds[0].title}\n${arg1.embeds[0].description}**`;
		}

		const textChannel = guild.channels.cache.get(channel.id) as TextChannel;
		await textChannel.send({embeds: [responseBuilder(type, arg1, arg2)]});
	},
};

function responseBuilder(
	type: messageType, arg1: any, arg2: any): MessageEmbed {
	switch (type) {
		case messageType.EDITED:
			return createEmbed('#ab9713', '', '', '', '', '',
				`Message edited by <@${arg1.author.id}> in <#${arg1.channel.id}>:`,
				'', [
					{name: 'Before:', value: arg1.content},
					{name: 'After:', value: arg2.content},
					{name: 'Message Link:', value: arg1.link}]);

		case messageType.DELETED:
			return createEmbed('#ab1327', '', '', '', '', '',
				`Message sent by <@${arg1.author.id}> deleted in <#${arg1.channel.id}>:`,
				'', [
					{name: 'Original Message:', value: arg1.content}]);

		case messageType.JOINED:
			return createEmbed('#37d893', 'Member Joined:', '', '', '', '',
				`<@${arg1.user.id}> ${arg1.user.username}`);

		case messageType.LEFT:
			return createEmbed('#d9367d', 'Member Left:', '', '', '', '',
				`<@${arg1.user.id}> ${arg1.user.username}`);

		default:
			throw new Error('Unknown message type');
	}
}

export async function logs(
	interaction: CommandInteraction, guild: Guild): Promise<MessageEmbed> {
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
	interaction: CommandInteraction, guild: Guild): Promise<MessageEmbed> {
	let textChannel = interaction.options.getChannel('channel', true);

	let server = await getServerById(guild.id) ??
		await createServer(guild.id);
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
	return createEmbed('#0f0', '', '', '', '', '',
		`The ${discord_channel?.toString()} channel will now be used for logs`);
}

async function disable(guild: Guild): Promise<MessageEmbed> {
	if (!await serverHasChannel(guild)) {
		return createEmbed('#f9a825', '', '', 'Warning!', '', '',
			'No logs channel is setup yet!');
	}

	let server = await getServerById(guild.id);
	if (server === null) return createEmbed('#f9a825', '', '', 'Warning!', '',
		'', 'No logs channel is setup yet!');
	if (server === undefined) throw new Error('Could not find a server');

	await deleteServerLogChannel(server.id);
	return createEmbed('#0f0', '', '', '', '', '',
		'The logs channel has been removed. Logs will no longer be kept');
}
