import {Guild, TextChannel} from 'discord.js';

import {log} from '../logger.js';
import {createServer, getServerById} from '../db/servers.js';
import {getServerLogChannelById} from '../db/server-log-channels.js';
import {createChannel, getChannelById} from '../db/channels.js';

export async function getLogChannel(guild: Guild): Promise<TextChannel | null> {
	const server = await getServerById(guild.id) ??
		await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	const server_log_channel = await getServerLogChannelById(server.id);
	if (server_log_channel === null) return null;
	if (server_log_channel === undefined) throw new Error(
		'Could not find server log channel');

	let channel = await getChannelById(server_log_channel.channel_id) ??
		await createChannel(server_log_channel.channel_id);
	if (!channel) throw new Error('Could not find or create a channel');

	return await getTextChannel(guild, channel.id);
}

async function getTextChannel(
	guild: Guild, channelId: string): Promise<TextChannel | null> {
	const channel = guild.channels.cache.get(channelId) ??
		await guild.channels.fetch(channelId);
	if (!channel) {
		throw new Error(
			`Could not find channel with ID ${channelId} in guild ${guild.id}`);
	}
	if (channel instanceof TextChannel) {
		return channel;

	}

	log.warn(`Channel ${channel.id} is not text channel`);
	return null;
}
