import {log} from '../logger.js';

import type {
	CreationOptional, InferAttributes, InferCreationAttributes,
} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

class Channel extends Model<InferAttributes<Channel>, InferCreationAttributes<Channel>> {
	declare id: CreationOptional<string>;
}

export const channels = sequelize.define<Channel>('channels', {
	id: {
		type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
	},
});

export async function createChannel(id: string): Promise<Channel | undefined> {
	try {
		return await channels.create({
			id: id,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getChannelById(id: string): Promise<Channel | null | undefined> {
	try {
		return await channels.findOne({
			where: {
				id: id,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
