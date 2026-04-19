import {log} from '../logger.js';

import type {InferAttributes, InferCreationAttributes} from 'sequelize';
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './client.js';

import {servers} from './servers.js';
import {channels} from './channels.js';

class ServerLogChannel extends Model<InferAttributes<ServerLogChannel>, InferCreationAttributes<ServerLogChannel>> {
	declare server_id: string;
	declare channel_id: string;
}

export const serverLogChannels = sequelize.define<ServerLogChannel>(
	'server_log_channels', {
		server_id: {
			type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
		}, channel_id: {
			type: DataTypes.DECIMAL(19, 0), allowNull: false, primaryKey: true,
		},
	});

servers.hasMany(serverLogChannels, {
	foreignKey: 'server_id', sourceKey: 'id',
});
channels.hasMany(serverLogChannels, {
	foreignKey: 'channel_id', sourceKey: 'id',
});

export async function createServerLogChannel(
	serverId: string,
	channelId: string): Promise<ServerLogChannel | undefined> {
	try {
		return await serverLogChannels.create({
			server_id: serverId, channel_id: channelId,
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function getServerLogChannelById(serverId: string): Promise<ServerLogChannel | null | undefined> {
	try {
		return await serverLogChannels.findOne({
			where: {
				server_id: serverId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function updateServerLogChannel(
	serverId: string,
	channelId: string): Promise<[affectedCount: number] | undefined> {
	try {
		return await serverLogChannels.update({
			channel_id: channelId,
		}, {
			where: {
				server_id: serverId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}

export async function deleteServerLogChannel(serverId: string): Promise<number | undefined> {
	try {
		return await serverLogChannels.destroy({
			where: {
				server_id: serverId,
			},
		});
	} catch (err) {
		log.error(err);
		return;
	}
}
