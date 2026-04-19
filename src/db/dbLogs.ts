import {Guild} from 'discord.js';

import {getServerLogChannelById} from './server-log-channels.js';

export async function serverHasChannel(guild: Guild): Promise<boolean> {
    return !!await getServerLogChannelById(guild.id);
}
