import {bot} from '../bot.js';
import {log} from '../logger.js';
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
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
		let guildID = interaction.guildId;
		let authorID = interaction.user?.id;
		log.verbose(
			`Interaction used by ${authorID} in guild ${guildID} in channel ${interaction.channelId}`);

		if (interaction.isChatInputCommand()) {
			await applicationCommandInteraction(interaction);
			return;
		}

		if (interaction.isMessageComponent()) {
			await messageComponentInteraction(interaction);
			return;
		}

		if (interaction.isAutocomplete()) {
			await applicationCommandAutocompleteInteraction(interaction);
			return;
		}

		if (interaction.isModalSubmit()) {
			await modalSubmitInteraction(interaction);
			return;
		}

		log.error(`Unknown interaction type: ${interaction.type}`);
	} catch (err) {
		log.error(err);
	}
}

async function applicationCommandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
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
				await interaction.reply({embeds: [await level(guild, author)]});
				return;
			} else if (member.user.bot) {
				await interaction.reply({embeds: [infinite()]});
				return;
			} else {
				await interaction.reply(
					{embeds: [await level(guild, member, author)]});
				return;
			}

		case 'logs':
			await interaction.reply({embeds: [await logs(interaction, guild)]});
			return;

		case 'buttonrole':
			const message = buttonRole(interaction);
			await interaction.reply({
				content: message.content, components: message.components,
			});
			return;

		case 'role':
			await interaction.reply({embeds: [await role(interaction, guild)]});
			return;

		case 'startscore':
			await interaction.reply({
				embeds: [
					createEmbed({
						color: 'Yellow', description: 'Scoring members...',
					})],
			});
			const channel = await bot.channels.fetch(
				interaction.channelId!) as TextChannel;
			await channel.send({embeds: [await startScore(guild)]});
			return;

		case 'test':
			await interaction.reply({embeds: [test()]});
			return;
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
