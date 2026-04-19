import {bot} from './bot.js';
import {log} from './logger.js';
import type {
	ColorResolvable, EmbedAuthorData, EmbedFieldData, EmbedFooterData,
} from 'discord.js';
import {
	GuildMember, Interaction, MessageEmbed, Role, TextChannel,
} from 'discord.js';

export function hasRole(member: GuildMember, roleID: string): boolean {
	return member.roles.cache.has(roleID);
}

export async function giveRole(
	member: GuildMember, role: Role, roleID: string): Promise<void> {
	if (hasRole(member, roleID)) {
		log.notice(`${member.id} already has ${role.id}, no role awarded`);
		return;
	}

	await member.roles.add(role);
	log.info(`${member.id} awarded ${role.id} role`);
}

export async function removeRole(
	member: GuildMember, role: Role): Promise<void> {
	if (!hasRole(member, role.id)) {
		log.notice(`${member.id} doesn't have ${role.id}, no role removed`);
		return;
	}

	await member.roles.remove(role);
	log.info(`${member.id} removed ${role.id} role`);
}

export async function ready() {
	try {
		// TODO: bot.guilds.cache.size
		bot.user?.setPresence({
			activities: [{name: `Star Wars`, type: 'WATCHING'}],
			status: 'online',
		});
		log.info(`Logged in as ${bot.user?.tag}`);
		const statusChannel = await bot.channels.fetch(
			'738439111412809730') as TextChannel;
		await statusChannel.send(':green_circle: Bot has started.');
	} catch (err) {
		log.error(err);
	}
}

export async function shutdown() {
	try {
		log.info('Shutting down...')
		const statusChannel = await bot.channels.fetch(
			'738439111412809730') as TextChannel;
		await statusChannel.send(':red_circle: Bot has stopped.');
	} catch (err) {
		log.error(err);
	}

	process.exit(0);
}

export function createEmbed(
	Color: ColorResolvable = '#000', Title: string = '',
	URL: string = '', Author: string = '',
	AuthorImage: string | undefined = undefined,
	AuthorURL: string | undefined = undefined,
	Description: string = 'Description',
	Thumbnail: string = '',
	Fields: EmbedFieldData[] = [], Image: string = '',
	Footer: string = '',
	FooterURL: string | undefined = undefined): MessageEmbed {
	return new MessageEmbed().
		setColor(Color).
		setTitle(Title).
		setURL(URL).
		setAuthor({
			name: Author, url: AuthorURL, iconURL: AuthorImage,
		} as EmbedAuthorData).
		setDescription(Description).
		setThumbnail(Thumbnail).
		addFields(Fields).
		setImage(Image).
		setTimestamp().
		setFooter({text: Footer, iconURL: FooterURL} as EmbedFooterData);
}

export async function requireGuildMember(interaction: Interaction): Promise<GuildMember | null> {
	if (!interaction.inGuild() || !interaction.guild) return null;
	if (interaction.member instanceof GuildMember) return interaction.member;

	try {
		return await interaction.guild.members.fetch(interaction.user.id);
	} catch (err) {
		log.error(err);
		return null;
	}
}
