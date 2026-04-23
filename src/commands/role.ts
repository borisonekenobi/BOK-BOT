import {log} from '../logger.js';
import {
	type APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, Guild, Role,
} from 'discord.js';

import {createEmbed} from '../util.js';
import {
	addRole, editRole, listRoles, removeRole, serverHasRole,
} from '../db/dbRole.js';

export async function role(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	let subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case 'add':
			return await add(interaction, guild);
		case 'edit':
			return await edit(interaction, guild);
		case 'list':
			return await list(guild);
		case 'remove':
			return await remove(interaction, guild);
		default:
			throw new Error('Unknown subcommand');
	}
}

async function add(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	const commandRole = await getRole(interaction, guild);
	const level = interaction.options.getInteger('level', true);
	if (!commandRole) {
		throw new Error('Role not found');
	}

	if (await serverHasRole(guild, commandRole)) {
		return createEmbed({
			color: 'DarkGold',
			title: 'Warning!',
			description: 'That role is already setup!\n*Use* `/role edit` *to edit a role*',
		});
	}

	await addRole(guild, commandRole, level);

	const role = guild.roles.cache.find(role => role.id === commandRole.id);
	return createEmbed({
		color: 'Green',
		description: `The ${role?.toString()} role has been set to level ${level}`,
	});
}

async function edit(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	let commandRole = await getRole(interaction, guild);
	let level = interaction.options.getInteger('level', true);
	if (!commandRole) {
		throw new Error('Role not found');
	}

	if (!await serverHasRole(guild, commandRole)) {
		return createEmbed({
			color: 'DarkGold',
			title: 'Warning!',
			description: 'Role is not setup yet!\n*Use* `/role add` *to add a role*',
		});
	}

	await editRole(guild, commandRole, level);

	const role = guild.roles.cache.find(role => role.id === commandRole.id);
	return createEmbed({
		color: 'Green',
		description: `The ${role?.toString()} role's level has been changed to ${level}`,
	});
}

async function list(guild: Guild): Promise<EmbedBuilder> {
	let roles = await listRoles(guild);
	if (roles === undefined) {
		log.error(`Failed to get roles for guild ${guild.id}`);
		roles = [];
	}

	const fields: APIEmbedField[] = [];
	for (let server_role of roles) {
		let role = guild.roles.cache.find(
			role => role.id === server_role.role_id);
		if (!role) {
			log.error(
				`Role ${server_role.role_id} configured for guild ${guild.id} was not found in the Discord role cache`);
			continue;
		}

		let level = server_role.level === 0 ?
			'Join Server:' :
			`Level ${server_role.level}:`;
		fields.push({name: level, value: role.toString()});
	}

	if (fields.length === 0) {
		return createEmbed({
			color: 'Green',
			description: 'No roles have been setup!\n*Use* `/role add` *to add a role*',
		});
	} else {
		return createEmbed({
			color: 'Green',
			description: 'All roles and their levels',
			fields: fields,
		});
	}
}

async function remove(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<EmbedBuilder> {
	let commandRole = await getRole(interaction, guild);
	if (!commandRole) {
		throw new Error('Role not found');
	}

	if (!await serverHasRole(guild, commandRole)) {
		return createEmbed({
			color: 'DarkGold',
			title: 'Warning!',
			description: 'Role is not setup yet!\n*Use* `/role add` *to add a role*',
		});
	}

	await removeRole(guild, commandRole);

	const role = guild.roles.cache.find(role => role.id === commandRole.id);
	return createEmbed({
		color: 'Green',
		description: `The ${role?.toString()} role has been removed`,
	});
}

async function getRole(
	interaction: ChatInputCommandInteraction,
	guild: Guild): Promise<Role | null> {
	const role = interaction.options.getRole('role', true);
	if (role instanceof Role) return role;

	const cached = guild.roles.cache.get(role.id);
	if (cached) return cached;

	try {
		return await guild.roles.fetch(role.id);
	} catch (err) {
		log.error(err);
		return null;
	}
}
