import {log} from '../logger.js';
import {Guild, MessageEmbed} from 'discord.js';

import {getServerUsers} from '../db/server-users.js';
import {getServerRoles} from '../db/server-roles.js';
import {createServer, getServerById} from '../db/servers.js';
import {createEmbed, giveRole} from '../util.js';

export async function startScore(guild: Guild): Promise<MessageEmbed> {
	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let server_users = await getServerUsers(server.id);
	let server_roles = await getServerRoles(server.id);

	if (!server_users || !server_roles) throw new Error(
		'Could not find server information');

	for (const server_user of server_users) {
		let member = await guild.members.fetch(server_user.user_id).
			catch(() => null);
		if (!member) {
			log.error(`Could not find a member with id ${server_user.user_id}`);
			continue;
		}

		for (const server_role of server_roles) {
			if (server_role.level > server_user.level) continue;

			const role = guild.roles.cache.find(
				role => role.id === server_role.role_id);
			if (!role) {
				log.error(
					`Could not find a role with id ${server_role.role_id}`);
				continue;
			}

			await giveRole(member, role, role.id);
		}
	}

	return createEmbed('#0f0', '', '', '', '', '', 'Done scoring members');
}
