import {log} from '../logger.js';
import {GuildMember, type PartialGuildMember} from 'discord.js';

import {server} from '../commands/server-logs.js';
import {messageType} from '../types.js';
import {newBotMember} from '../commands/new-bot-member.js';
import {newMember} from '../commands/new-member.js';

export async function guildMemberAdd(member: GuildMember): Promise<void> {
	try {
		const guild = member.guild;
		log.verbose(`${member.id} joined ${guild.id}`);

		await server.log(messageType.JOINED, guild, member);

		switch (member.user.bot) {
			case true:
				await newBotMember(guild, member);
				break;
			case false:
				await newMember(guild, member);
				break;
			default:
				log.verbose('member\'s user.bot is neither true nor false, no roles given');
		}
	} catch (err) {
		log.error(err);
	}
}

export async function guildMemberRemove(member: GuildMember | PartialGuildMember): Promise<void> {
	try {
		log.verbose(`${member.id} left ${member.guild.id}`);
		await server.log(messageType.LEFT, member.guild, member);
	} catch (err) {
		log.error(err);
	}
}
