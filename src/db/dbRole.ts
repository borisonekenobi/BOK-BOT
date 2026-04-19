import {Guild, Role} from 'discord.js';

import {
	createServerRole,
	deleteServerRole,
	getServerRoleByIds,
	getServerRoles,
	updateServerRole,
} from './server-roles.js';
import {createServer, getServerById} from './servers.js';
import {createRole, getRoleById} from './roles.js';

export async function serverHasRole(
	guild: Guild, role: Role): Promise<boolean> {
	return !!await getServerRoleByIds(guild.id, role.id);
}

export async function addRole(
	guild: Guild, role: Role, level: number): Promise<void> {
	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let bRole = await getRoleById(role.id) ?? await createRole(role.id);
	if (!bRole) throw new Error('Could not find or create a role');

	let server_role = await getServerRoleByIds(server.id, bRole.id) ??
		await createServerRole(server.id, bRole.id, level);
	if (!server_role) throw new Error('Could not find or create a server role');
}

export async function editRole(
	guild: Guild, role: Role, level: number): Promise<void> {
	let server = await getServerById(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let bRole = await getRoleById(role.id);
	if (!bRole) throw new Error('Could not find or create a role');

	await updateServerRole(server.id, bRole.id, level);
}

export async function listRoles(guild: Guild) {
	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	return await getServerRoles(server.id);
}

export async function removeRole(guild: Guild, role: Role): Promise<void> {
	let server = await getServerById(guild.id);
	if (!server) throw new Error('Could not find server');

	let bRole = await getRoleById(role.id);
	if (!bRole) throw new Error('Could not find role');

	await deleteServerRole(server.id, bRole.id);
}
