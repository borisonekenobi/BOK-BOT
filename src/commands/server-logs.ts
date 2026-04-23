import {
	ChatInputCommandInteraction, EmbedBuilder, Guild, TextChannel,
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
	type: messageType, arg1: any, arg2: any): EmbedBuilder {
	switch (type) {
		case messageType.EDITED:
			return createEmbed({
				color: 'Yellow',
				description: `Message edited by <@${arg1.author.id}> in <#${arg1.channel.id}>:`,
				fields: [
					{name: 'Before:', value: arg1.content},
					{name: 'After:', value: arg2.content},
					{name: 'Message Link:', value: arg1.link}],
			});

		case messageType.DELETED:
			return createEmbed({
				color: 'Red',
				description: `Message sent by <@${arg1.author.id}> deleted in <#${arg1.channel.id}>:`,
				fields: [
					{name: 'Original Message:', value: arg1.content}],
			});

		case messageType.JOINED:
			return createEmbed({
				color: 'Green',
				title: 'Member Joined:',
				description: `<@${arg1.user.id}> ${arg1.user.username}`,
			});

		case messageType.LEFT:
			return createEmbed({
				color: 'DarkVividPink',
				title: 'Member Left:',
				description: `<@${arg1.user.id}> ${arg1.user.username}`,
			});

		default:
			throw new Error('Unknown message type');
	}
}

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
	if (!('isTextBased' in textChannel) || !textChannel.isTextBased()) {
		return createEmbed({
			color: 'Red',
			title: 'Error!',
			description: 'Selected channel must be text-based!',
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
