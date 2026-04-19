import {log} from '../logger.js';
import {Guild, GuildMember} from 'discord.js';

import {giveRole} from '../util.js';
import {getServerRoles} from '../db/server-roles.js';
import {createServer, getServerById} from '../db/servers.js';
import {createUser, getUserById} from '../db/users.js';
import {createServerUser, getServerUserByIds} from '../db/server-users.js';

export async function newMember(guild: Guild, member: GuildMember) {
	const date = member.joinedAt ?? new Date();

	let server = await getServerById(guild.id) ??
		await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let user = await getUserById(member.id) ??
		await createUser(member.id);
	if (!user) throw new Error('Could not find or create a user');

	let server_user = await getServerUserByIds(server.id, user.id) ??
		await createServerUser(server.id, user.id, date);
	if (!server_user) throw new Error('Could not find or create a server user');

	let server_roles = await getServerRoles(server.id);
	if (server_roles === undefined) throw new Error(
		`Failed to get server roles for server ${server.id}`);

	for (const server_role of server_roles) {
		if (server_role.level > server_user.level) continue;

		const role = guild.roles.cache.find(
			role => role.id === server_role.role_id);
		if (!role) {
			log.error(`Could not find a role with id ${server_role.role_id}`);
			continue;
		}

		await giveRole(member, role, role.id);
	}
}
