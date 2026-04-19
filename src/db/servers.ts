import {log} from '../logger.js';

import type {
	CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

class Server extends Model<InferAttributes<Server>, InferCreationAttributes<Server>> {
	declare id: CreationOptional<string>;
}

export const servers = sequelize.define<Server>('servers', {
	id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	},
});

export async function createServer(id: string): Promise<Server | undefined> {
	try {
		return await servers.create({
			id: id,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerById(id: string): Promise<Server | null | undefined> {
	try {
		return await servers.findOne({
			where: {
				id: id,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
