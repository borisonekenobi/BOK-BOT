import {EmbedBuilder} from 'discord.js';

import {createEmbed} from '../util.js';

export function test(): EmbedBuilder {
	return createEmbed({
		color: 'Green',
		title: 'Test Successful!',
		description: 'Test Successful!',
	});
}
