import {log} from '../logger.js';

import type {InferAttributes, InferCreationAttributes} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

import {servers} from './servers.js';
import {roles} from './roles.js';

class ServerBotRole extends Model<InferAttributes<ServerBotRole>, InferCreationAttributes<ServerBotRole>> {
	declare server_id: string;
	declare role_id: string;
}

export const serverBotRoles = sequelize.define<ServerBotRole>(
	'server_bot_roles', {
		server_id: {
			type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
		}, role_id: {
			type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
		},
	});

servers.hasMany(serverBotRoles, {
	foreignKey: 'server_id', sourceKey: 'id',
});
roles.hasMany(serverBotRoles, {
	foreignKey: 'role_id', sourceKey: 'id',
});

export async function getServerBotRoles(serverId: string): Promise<ServerBotRole[] | undefined> {
	try {
		return await serverBotRoles.findAll({
			where: {
				server_id: serverId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
