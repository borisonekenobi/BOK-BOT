import {bot} from '../bot.js';
import {log} from '../logger.js';
import {
	AutocompleteInteraction,
	CommandInteraction,
	Interaction,
	MessageComponentInteraction,
	ModalSubmitInteraction,
	TextChannel,
} from 'discord.js';

import {infinite, level} from '../commands/level.js';
import {logs} from '../commands/server-logs.js';
import {buttonClicked, buttonRole} from '../commands/button-role.js';
import {role} from '../commands/role.js';
import {startScore} from '../commands/start-score.js';
import {test} from '../commands/test.js';

import {createEmbed, requireGuildMember} from '../util.js';

export async function interaction(interaction: Interaction): Promise<void> {
	try {
		let type = interaction.type;

		let guildID = interaction.guildId;
		let authorID = interaction.member?.user.id;
		log.info(
			`Interaction type ${type} used by ${authorID} in guild ${guildID} in channel ${interaction.channelId}`);

		switch (type) {
			case 'PING':
				await pingInteraction(interaction);
				break;

			case 'APPLICATION_COMMAND':
				await applicationCommandInteraction(
					interaction as CommandInteraction);
				break;

			case 'MESSAGE_COMPONENT':
				return await messageComponentInteraction(
					interaction as MessageComponentInteraction);

			case 'APPLICATION_COMMAND_AUTOCOMPLETE':
				await applicationCommandAutocompleteInteraction(
					interaction as AutocompleteInteraction);
				break;

			case 'MODAL_SUBMIT':
				await modalSubmitInteraction(
					interaction as ModalSubmitInteraction);
				break;

			default:
				log.error(`Unknown interaction type: ${interaction.type}`);
		}
	} catch (err) {
		log.error(err);
	}
}

async function pingInteraction(interaction: Interaction): Promise<void> {
	log.debug('type == 1');
	log.debug(interaction);
}

async function applicationCommandInteraction(interaction: CommandInteraction): Promise<void> {
	let name = interaction.commandName;

	let guild = interaction.guild;
	if (!guild) {
		throw new Error('Interaction has no guild');
	}

	let author = await requireGuildMember(interaction);
	if (!author) {
		throw new Error('Could not get GuildMember object from interaction');
	}

	switch (name) {
		case 'level':
			const targetUser = interaction.options.getUser('user', false);
			const member = targetUser ?
				await guild.members.fetch(targetUser.id) :
				undefined;

			if (!member || member.id === author.id) {
				return await interaction.reply(
					{embeds: [await level(guild, author)]});
			} else if (member.user.bot) {
				return await interaction.reply({embeds: [infinite()]});
			} else {
				return await interaction.reply(
					{embeds: [await level(guild, member, author)]});
			}

		case 'logs':
			return await interaction.reply(
				{embeds: [await logs(interaction, guild)]});

		case 'buttonrole':
			let message = buttonRole(interaction);
			await interaction.reply({
				content: message.content, components: message.components,
			});
			return;

		case 'role':
			return await interaction.reply(
				{embeds: [await role(interaction, guild)]});

		case 'startscore':
			await interaction.reply({
				embeds: [
					createEmbed('#ff0', '', '', '', '', '',
						'Scoring members...')],
			});
			const channel = await bot.channels.fetch(
				interaction.channelId!) as TextChannel;
			await channel.send({embeds: [await startScore(guild)]});
			return;

		case 'test':
			return await interaction.reply({embeds: [test()]});
	}

	throw new Error('Unknown slash command');
}

async function messageComponentInteraction(interaction: MessageComponentInteraction): Promise<void> {
	let guild = interaction.guild;
	if (!guild) {
		throw new Error('Interaction has no guild');
	}

	let author = await requireGuildMember(interaction);
	if (!author) {
		throw new Error('Could not get GuildMember object from interaction');
	}

	try {
		await interaction.deferUpdate();
	} catch (err) {
		log.error(err);
	}
	await buttonClicked(interaction, author, guild);
}

async function applicationCommandAutocompleteInteraction(interaction: AutocompleteInteraction): Promise<void> {
	log.debug('type == 4');
	log.debug(interaction);
}

async function modalSubmitInteraction(interaction: ModalSubmitInteraction): Promise<void> {
	log.debug('type == 5');
	log.debug(interaction);
}
