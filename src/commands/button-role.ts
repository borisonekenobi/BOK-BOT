import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	Guild,
	GuildMember,
	MessageComponentInteraction,
} from 'discord.js';

import {giveRole, hasRole, removeRole} from '../util.js';

export async function buttonClicked(
	interaction: MessageComponentInteraction,
	author: GuildMember,
	guild: Guild): Promise<void> {
	let roleId = interaction.customId;
	let role = guild.roles.cache.find(role => role.id === roleId);

	if (!role) {
		throw new Error(`Could not find a role with id ${roleId}`);
	}

	if (hasRole(author, roleId)) {
		await removeRole(author, role);
	} else {
		await giveRole(author, role, roleId);
	}
}

export function buttonRole(interaction: ChatInputCommandInteraction) {
	let subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case 'create':
			return create(interaction);
		case 'edit':
			return edit(/*interaction*/);
		default:
			throw new Error('Unknown subcommand');
	}
}

function create(interaction: ChatInputCommandInteraction) {
	const message = interaction.options.getString('message', true);
	const buttons: ButtonBuilder[] = [];

	for (let i = 1; i <= 5; i++) {
		const role = interaction.options.getRole(`role${i}`, i == 1);
		if (!role) continue;

		buttons.push(new ButtonBuilder().setLabel(role.name).
			setStyle(ButtonStyle.Primary).
			setCustomId(role.id));
	}

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

	return {
		content: message, components: [row],
	};
}

function edit(/*interaction: CommandInteraction*/) {
	return {
		content: 'This command is currently being worked on!', components: [],
	};
}
