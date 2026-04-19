import {log} from '../logger.js';
import {Guild, GuildMember} from 'discord.js';

import {createServer, getServerById} from '../db/servers.js';
import {getServerBotRoles} from '../db/server-bot-roles.js';
import {giveRole} from '../util.js';

export async function newBotMember(guild: Guild, member: GuildMember): Promise<void> {
    let server = await getServerById(guild.id) ?? await createServer(guild.id);
    if (!server) throw new Error('Could not find or create a server');

    let server_bot_roles = await getServerBotRoles(server.id);
    if (server_bot_roles === undefined) {
        throw new Error(`Failed to get server bot roles for guild ${guild.id}`);
    }

    for (const server_bot_role of server_bot_roles) {
        const role = guild.roles.cache.find(role => role.id === server_bot_role.role_id);
        if (!role) {
            log.error(`Could not find a role with id ${server_bot_role.role_id}`);
            continue;
        }

        await giveRole(member, role, role.id);
    }
}
