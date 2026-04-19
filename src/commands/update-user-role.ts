import {log} from '../logger.js';
import {Guild, GuildMember} from 'discord.js';

import {createServer, getServerById} from '../db/servers.js';
import {getServerRoles} from '../db/server-roles.js';
import {giveRole} from '../util.js';

export async function updateUserRole(
	guild: Guild, member: GuildMember, level: number): Promise<void> {
	let server = await getServerById(guild.id) ??
		await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	const server_roles = await getServerRoles(server.id, level);
	if (!server_roles) throw new Error('Could not find server roles');

	for (const server_role of server_roles) {
		const role = guild.roles.cache.find(role => role.id === server_role.role_id);
		if (!role) {
			log.error('Could not find a role');
			continue;
		}

		await giveRole(member, role, role.id);
	}
}
