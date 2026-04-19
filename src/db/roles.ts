import {log} from '../logger.js';

import type {
	CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
	declare id: CreationOptional<string>;
}

export const roles = sequelize.define<Role>('roles', {
	id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	},
});

export async function createRole(id: string): Promise<Role | undefined> {
	try {
		return await roles.create({
			id: id,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getRoleById(id: string): Promise<Role | null | undefined> {
	try {
		return await roles.findOne({
			where: {
				id: id,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
