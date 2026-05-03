import {Guild, Message, type PartialMessage} from 'discord.js';

import {createEmbed} from '../util.js';
import {getLogChannel} from './utils.js';

export async function logEditedMessage(
	guild: Guild,
	oldMessage: Message<boolean> | PartialMessage,
	newMessage: Message<boolean> | PartialMessage): Promise<void> {
	const channel = await getLogChannel(guild);
	if (!channel) return;

	await channel.send({
		embeds: [
			createEmbed({
				color: 'Yellow',
				description: `Message edited by <@${oldMessage.author?.id}> in <#${oldMessage.channel.id}>:`,
				fields: [
					{
						name: 'Author:',
						value: `<@${oldMessage.author?.id}> ${oldMessage.author?.username}`,
					}, {
						name: 'Before:',
						value: await stringifyMessageContent(oldMessage),
					}, {
						name: 'After:',
						value: await stringifyMessageContent(newMessage),
					}, {
						name: 'Message Link:', value: oldMessage.url,
					}],
			})],
	});
}

export async function logDeletedMessage(
	guild: Guild,
	message: Message<boolean> | PartialMessage): Promise<void> {
	const channel = await getLogChannel(guild);
	if (!channel) return;

	await channel.send({
		embeds: [
			createEmbed({
				color: 'Red',
				description: `Message sent by <@${message.author?.id}> deleted in <#${message.channel.id}>:`,
				fields: [
					{
						name: 'Author:',
						value: `<@${message.author?.id}> ${message.author?.username}`,
					}, {
						name: 'Original Message:',
						value: await stringifyMessageContent(message),
					}],
			})],
	});
}

export async function stringifyMessageContent(message: Message<boolean> | PartialMessage): Promise<string> {
	const parts: string[] = [];

	if (message.content) {
		parts.push(message.content);
	}

	if (message.embeds.length > 0) {
		parts.push(...message.embeds.map(
			embed => `**${embed.title}**\n${embed.description}`));
	}

	if (message.attachments.size > 0) {
		parts.push(`*[${message.attachments.size} attachment(s)]*`);
	}

	return parts.length > 0 ? parts.join('\n') : '*(no content)*';
}
