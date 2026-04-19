import {log} from '../logger.js';

import type {InferAttributes, InferCreationAttributes} from 'sequelize';
import {DataTypes, Model, Op} from 'sequelize';
import {sequelize} from './client.js';

import {servers} from './servers.js';
import {roles} from './roles.js';

class ServerRole extends Model<InferAttributes<ServerRole>, InferCreationAttributes<ServerRole>> {
	declare server_id: string;
	declare role_id: string;
	declare level: number;
}

export const serverRoles = sequelize.define<ServerRole>('server_roles', {
	server_id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	}, role_id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	}, level: {
		type: DataTypes.INTEGER, allowNull: false,
	},
});

servers.hasMany(serverRoles, {
	foreignKey: 'server_id', sourceKey: 'id',
});
roles.hasMany(serverRoles, {
	foreignKey: 'role_id', sourceKey: 'id',
});

export async function createServerRole(
	serverId: string, roleId: string,
	level: number): Promise<ServerRole | undefined> {
	try {
		return await serverRoles.create({
			server_id: serverId, role_id: roleId, level: level,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerRoleByIds(
	serverId: string, roleId: string): Promise<ServerRole | null | undefined> {
	try {
		return await serverRoles.findOne({
			where: {
				server_id: serverId, role_id: roleId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerRoles(
	serverId: string,
	minLevel: number = 0): Promise<ServerRole[] | undefined> {
	try {
		return await serverRoles.findAll({
			where: {
				server_id: serverId, level: {[Op.gte]: minLevel},
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function updateServerRole(
	serverId: string, roleId: string,
	level: number): Promise<[affectedCount: number] | undefined> {
	try {
		return await serverRoles.update({
			level: level,
		}, {
			where: {
				server_id: serverId, role_id: roleId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function deleteServerRole(
	serverId: string, roleId: string): Promise<number | undefined> {
	try {
		return await serverRoles.destroy({
			where: {
				server_id: serverId, role_id: roleId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
