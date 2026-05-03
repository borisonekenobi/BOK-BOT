import {Guild, GuildMember, type PartialGuildMember} from 'discord.js';

import {createEmbed} from '../util.js';
import {getLogChannel} from './utils.js';

export async function logJoinedServer(
	guild: Guild, member: GuildMember): Promise<void> {
	const channel = await getLogChannel(guild);
	if (!channel) return;

	await channel.send({
		embeds: [
			createEmbed({
				color: 'Green',
				title: 'Member Joined:',
				description: `<@${member.user.id}> ${member.user.username}`,
			})],
	});
}

export async function logLeftServer(
	guild: Guild, member: GuildMember | PartialGuildMember): Promise<void> {
	const channel = await getLogChannel(guild);
	if (!channel) return;

	await channel.send({
		embeds: [
			createEmbed({
				color: 'DarkVividPink',
				title: 'Member Left:',
				description: `<@${member.user.id}> ${member.user.username}`,
			})],
	});
}
