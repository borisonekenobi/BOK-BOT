import {log} from '../logger.js';
import {Guild, GuildMember} from 'discord.js';

import {createServer, getServerById} from './servers.js';
import {createUser, getUserById} from './users.js';
import {
	createServerUser, getServerUserByIds, ServerUserWithRank,
} from './server-users.js';
import {addPointsToUser, getPointsByLevel, getUserRank} from './util.js';

export async function updateUser(
	guild: Guild, guildMember: GuildMember, date: Date): Promise<number> {
	log.debug(`${guild.id} ${guildMember.id} ${date}`);
	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	log.debug(server);
	if (!server) throw new Error('Could not find or create a server');

	let user = await getUserById(guildMember.id) ??
		await createUser(guildMember.id);
	if (!user) throw new Error('Could not find or create a user');

	let server_user = await getServerUserByIds(server.id, user.id) ??
		await createServerUser(server.id, user.id, date);
	if (!server_user) throw new Error('Could not find or create a server user');

	const diffTimeMS = Math.abs(
		date.getTime() - server_user.last_earned_points.getTime());
	if (diffTimeMS < 60 * 1000) return 0;

	let level = await addPointsToUser(server.id, user.id, date);
	if (level === undefined) throw new Error('Could not add points to user');

	return level - server_user.level > 0 ? level : 0;
}

export async function getUser(
	guild: Guild,
	guildMember: GuildMember): Promise<ServerUserWithRank> {
	let server = await getServerById(guild.id) ?? await createServer(guild.id);
	if (!server) throw new Error('Could not find or create a server');

	let user = await getUserById(guildMember.id) ??
		await createUser(guildMember.id);
	if (!user) throw new Error('Could not find or create a user');

	let server_user = (await getServerUserByIds(server.id, user.id) ??
		await createServerUser(server.id, user.id,
			undefined)) as ServerUserWithRank;
	if (!server_user) throw new Error('Could not find or create a server user');

	const rank = await getUserRank(server.id, user.id);
	if (!rank) throw new Error('Could not find rank');
	server_user.rank = rank;

	return server_user;
}

export async function getPointsForLevel(level: number) {
	return await getPointsByLevel(level);
}
