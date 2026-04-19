import {log} from '../logger.js';

import {QueryTypes} from 'sequelize';
import {sequelize} from './client.js';

type RankRow = {
	rank: number;
}

export async function getUserRank(serverID: string, userID: string): Promise<number | undefined> {
	try {
		let res = await sequelize.query<RankRow>(
			'SELECT get_user_rank(:param1, :param2) AS rank;', {
				replacements: {
					param1: serverID, param2: userID,
				}, type: QueryTypes.SELECT,
			});

		return res.at(0)?.rank;
	} catch (err) {
		log.error(err);
		return;
	}
}

type LevelRow = {
	level: number;
}

export async function addPointsToUser(
	serverID: string, userID: string, date: Date): Promise<number | undefined> {
	try {
		let res = await sequelize.query<LevelRow>(
			'SELECT add_points_to_user(:param1, :param2, :param3) AS level;',
			{
				replacements: {
					param1: serverID, param2: userID, param3: date,
				}, type: QueryTypes.SELECT,
			});

		return res.at(0)?.level;
	} catch (err) {
		log.error(err);
		return;
	}
}

type PointsRow = {
	points: number;
}

export async function getPointsByLevel(level: number): Promise<number | undefined> {
	try {
		let res = await sequelize.query<PointsRow>(
			'SELECT points_for_level(:param1) AS points;', {
				replacements: {
					param1: level,
				}, type: QueryTypes.SELECT,
			});

		return res.at(0)?.points;
	} catch (err) {
		log.error(err);
		return;
	}
}
