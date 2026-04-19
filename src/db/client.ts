import 'dotenv/config';

import {log} from '../logger.js';
import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize(process.env['PG_DB']!,
	process.env['PG_USER']!, process.env['PG_PASS']!, {
		host: process.env['PG_HOST']!,
		port: parseInt(process.env['PG_PORT']!),
		dialect: 'postgres',
		define: {
			freezeTableName: true, timestamps: false,
		},
		logging: (msg: string) => log.debug(msg),
	});

try {
	await sequelize.authenticate();
} catch (err) {
	log.error(`Unable to connect to the database: ${err}`);
	process.exit(1);
}
