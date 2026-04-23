import {bot} from './bot.js';
import {log} from './logger.js';
import type {
	APIEmbedField, BaseInteraction, ColorResolvable,
} from 'discord.js';
import {ActivityType, EmbedBuilder, GuildMember, Role} from 'discord.js';

export function hasRole(member: GuildMember, roleID: string): boolean {
	return member.roles.cache.has(roleID);
}

export async function giveRole(
	member: GuildMember, role: Role, roleID: string): Promise<void> {
	if (hasRole(member, roleID)) {
		log.info(`${member.id} already has ${role.id}, no role awarded`);
		return;
	}

	await member.roles.add(role);
	log.verbose(`${member.id} awarded ${role.id} role`);
}

export async function removeRole(
	member: GuildMember, role: Role): Promise<void> {
	if (!hasRole(member, role.id)) {
		log.info(`${member.id} doesn't have ${role.id}, no role removed`);
		return;
	}

	await member.roles.remove(role);
	log.verbose(`${member.id} removed ${role.id} role`);
}

export async function ready(): Promise<void> {
	try {
		// TODO: bot.guilds.cache.size
		bot.user?.setPresence({
			// TODO: send request to twitch api to see if BOK is streaming
			activities: [{name: 'Star Wars', type: ActivityType.Watching}],
			status: 'online',
		});
		log.verbose(`Logged in as ${bot.user?.tag}`);
		await sendStatusMessage(':green_circle: Bot has started.');
	} catch (err) {
		log.error(err);
	}
}

export async function shutdown(): Promise<never> {
	try {
		log.verbose('Shutting down...');
		await sendStatusMessage(':red_circle: Bot has stopped.');
	} catch (err) {
		log.error(err);
	}

	process.exit(0);
}

type CreateEmbedOptions = {
	color?: ColorResolvable;
	title?: string;
	url?: string;
	author?: string;
	authorImage?: string;
	authorURL?: string;
	description?: string;
	thumbnail?: string;
	fields?: APIEmbedField[];
	image?: string;
	footer?: string;
	footerURL?: string | undefined;
}

export function createEmbed({
								color = 'Default',
								title = '',
								url = '',
								author = '',
								authorImage = undefined,
								authorURL = undefined,
								description = 'Description',
								thumbnail = '',
								fields = [],
								image = '',
								footer = '',
								footerURL = undefined,
							}: CreateEmbedOptions = {}): EmbedBuilder {
	const embed = new EmbedBuilder().setColor(color).setTimestamp();

	if (title) embed.setTitle(title);
	if (url) embed.setURL(url);
	if (author) {
		embed.setAuthor({
			name: author, ...(authorURL ?
				{url: authorURL} :
				{}), ...(authorImage ? {iconURL: authorImage} : {}),
		});
	}
	if (description) embed.setDescription(description);
	if (thumbnail) embed.setThumbnail(thumbnail);
	if (fields.length > 0) embed.addFields(fields);
	if (image) embed.setImage(image);
	if (footer) {
		embed.setFooter({
			text: footer, ...(footerURL ? {iconURL: footerURL} : {}),
		});
	}

	return embed;
}

async function sendStatusMessage(message: string): Promise<void> {
	const channel = await bot.channels.fetch('738439111412809730');
	if (!channel) {
		log.warn(
			'Status message not sent: channel 738439111412809730 was not found');
		return;
	}
	if (!channel.isTextBased()) {
		log.warn(
			`Status message not sent: channel ${channel.id} is not text-based`);
		return;
	}
	if (!channel.isSendable()) {
		log.warn(
			`Status message not sent: channel ${channel.id} is not sendable`);
		return;
	}

	await channel.send(message);
}

export async function requireGuildMember(interaction: BaseInteraction): Promise<GuildMember | null> {
	if (!interaction.inGuild() || !interaction.guild) return null;
	if (interaction.member instanceof GuildMember) return interaction.member;

	try {
		return await interaction.guild.members.fetch(interaction.user.id);
	} catch (err) {
		log.error(err);
		return null;
	}
}
