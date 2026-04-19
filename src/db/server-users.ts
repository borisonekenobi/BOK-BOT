import {log} from '../logger.js';

import type {
	CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

import {servers} from './servers.js';
import {users} from './users.js';

class ServerUser extends Model<InferAttributes<ServerUser>, InferCreationAttributes<ServerUser>> {
	declare server_id: string;
	declare user_id: string;
	declare level: CreationOptional<number>;
	declare points: CreationOptional<number>;
	declare last_earned_points: CreationOptional<Date>;
}

export class ServerUserWithRank extends ServerUser {
	declare rank: number;
}

export const serverUsers = sequelize.define<ServerUser>('server_users', {
	server_id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	}, user_id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	}, level: {
		type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
	}, points: {
		type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
	}, last_earned_points: {
		type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,
	},
});

servers.hasMany(serverUsers, {
	foreignKey: 'server_id', sourceKey: 'id',
});
users.hasMany(serverUsers, {
	foreignKey: 'user_id', sourceKey: 'id',
});

export async function createServerUser(
	serverId: string, userId: string,
	date: Date | undefined): Promise<ServerUser | undefined> {
	try {
		return await serverUsers.create({
			server_id: serverId, user_id: userId, last_earned_points: date,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerUserByIds(
	serverId: string, userId: string): Promise<ServerUser | null | undefined> {
	try {
		return await serverUsers.findOne({
			where: {
				server_id: serverId, user_id: userId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerUsers(serverId: string): Promise<ServerUser[] | undefined> {
	try {
		return await serverUsers.findAll({
			where: {
				server_id: serverId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
