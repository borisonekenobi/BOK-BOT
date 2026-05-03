import {log} from '../logger.js';
import {GuildMember, Message, type PartialMessage} from 'discord.js';

import {updateUserRole} from '../commands/update-user-role.js';
import {updateUser} from '../db/dbLevel.js';
import {
	logDeletedMessage,
	logEditedMessage,
} from '../log-events/message-events.js';

export async function messageCreate(msg: Message<boolean>): Promise<void> {
	try {
		if (msg.author.bot) return;

		let guild = msg.guild;
		if (!guild) {
			log.error('Message has no guild');
			return;
		}

		let author = await getGuildMemberFromMessage(msg);
		if (!author) {
			log.error('Could not get GuildMember object from message');
			return;
		}

		let levelIncreased = await updateUser(guild, author, msg.createdAt);
		if (levelIncreased === 0) return;

		await updateUserRole(guild, author, levelIncreased);
		await sendIfPossible(msg.channel,
			`GG <@${msg.author.id}>, you just advanced to level ${levelIncreased}!`);
	} catch (err) {
		log.error(err);
	}
}

export async function messageUpdate(
	oldMessage: Message<boolean> | PartialMessage,
	newMessage: Message<boolean> | PartialMessage): Promise<void> {
	try {
		const guild = oldMessage.guild;
		if (!guild) {
			log.error('Message has no guild');
			return;
		}

		log.verbose(
			`${oldMessage.author?.id} edited message in guild ${guild.id} in channel ${oldMessage.channel.id}`);
		await logEditedMessage(guild, oldMessage, newMessage);
	} catch (err) {
		log.error(err);
	}
}

export async function messageDelete(deleteMessage: Message<boolean> | PartialMessage): Promise<void> {
	try {
		const guild = deleteMessage.guild;
		if (!guild) {
			log.error('Message has no guild');
			return;
		}

		log.verbose(
			`${deleteMessage.author?.id} deleted message in guild ${guild.id} in channel ${deleteMessage.channel.id}`);
		await logDeletedMessage(guild, deleteMessage);
	} catch (err) {
		log.error(err);
	}
}

async function sendIfPossible(
	channel: Message<boolean>['channel'] | PartialMessage['channel'],
	content: string): Promise<void> {
	if (!channel.isTextBased() || !('send' in channel)) return;

	await channel.send(content);
}

async function getGuildMemberFromMessage(msg: Message<boolean>): Promise<GuildMember | null> {
	if (!msg.inGuild() || !msg.guild) return null;

	const cached = msg.guild.members.cache.get(msg.author.id);
	if (cached) return cached;

	try {
		return await msg.guild.members.fetch(msg.author.id);
	} catch (err) {
		log.error(err);
		return null;
	}
}
