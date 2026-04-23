import {EmbedBuilder, Guild, GuildMember} from 'discord.js';
import {createEmbed} from '../util.js';
import {getPointsForLevel, getUser} from '../db/dbLevel.js';

export async function level(
	guild: Guild, member: GuildMember,
	otherMember: GuildMember | undefined = undefined): Promise<EmbedBuilder> {
	const user = await getUser(guild, member);
	const pointsForNextLevel = await getPointsForLevel(user.level + 1);
	if (!pointsForNextLevel) {
		throw new Error(`Unable to find points for level ${user.level + 1}`);
	}

	const otherMemberText = otherMember ? `${member.displayName} - ` : '';

	const percent = Math.round(user.points / pointsForNextLevel * 100);

	const numFilled = Math.round(percent / 5);
	const numEmpty = 20 - numFilled;

	const underline = '⠀'.repeat(10);

	const filled = '█'.repeat(numFilled);
	const empty = '▒'.repeat(numEmpty);

	const fields = [
		{
			name: `__${underline}⠀${percent}%${underline}${percent >= 10 ?
				'' :
				'⠀'}__`,
			value: `${user.level} ${filled}${empty} ${user.level + 1}`,
		}];

	return createEmbed({
		color: 'Green',
		title: `${otherMemberText}Rank #${user.rank} - Level ${user.level}`,
		description: `${user.points}/${pointsForNextLevel}`,
		fields: fields,
	});
}

export function infinite(): EmbedBuilder {
	const underline = '⠀'.repeat(11);
	const fields = [
		{
			name: `__${underline}∞%${underline}__`,
			value: `∞ ${'█'.repeat(20)} ∞`,
		}];
	return createEmbed({
		color: 'Green', title: `Level ∞`, description: `∞/∞`, fields: fields,
	});
}
