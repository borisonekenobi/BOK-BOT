import {log} from '../logger.js';

import type {
	CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<string>;
}

export const users = sequelize.define<User>('users', {
	id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	},
});

export async function createUser(id: string): Promise<User | undefined> {
	try {
		return await users.create({
			id: id,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getUserById(id: string): Promise<User | null | undefined> {
	try {
		return await users.findOne({
			where: {
				id: id,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
