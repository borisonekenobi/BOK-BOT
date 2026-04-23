import * as winston from 'winston';

const date_ob = new Date();
const year = date_ob.getFullYear();
const month = pad(date_ob.getMonth() + 1);
const date = pad(date_ob.getDate());
const hours = pad(date_ob.getHours());
const minutes = pad(date_ob.getMinutes());
const seconds = pad(date_ob.getSeconds());
const logFile = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}.log`;

function pad(value: number): string {
	return value.toString().padStart(2, '0');
}

const fileFormat = winston.format.combine(winston.format.timestamp(),
	winston.format.printf(({timestamp, level, message, app, ...meta}) => {
		const metaString = Object.keys(meta).length ?
			` ${JSON.stringify(meta)}` :
			'';
		return `${timestamp} [${app}] ${level}: ${message}${metaString}`;
	}));

// const consoleFormat = winston.format.combine(
// 	winston.format.colorize(),
// 	winston.format.timestamp(),
// 	winston.format.printf(({timestamp, level, message}) => `${timestamp} ${level}: ${message}`),
// );

const logger = winston.createLogger({
	level: 'debug', defaultMeta: {app: 'BOK-BOT'}, transports: [
		new winston.transports.File({
			filename: `logs/${logFile}`, format: fileFormat,
		}), new winston.transports.Console({
			format: winston.format.cli(),
		})],
});

export const log = {
	error(message: unknown): void {
		logger.error(String(message));
	},

	warn(message: unknown): void {
		logger.warn(String(message));
	},

	info(message: unknown): void {
		logger.info(String(message));
	},

	verbose(message: unknown): void {
		logger.verbose(String(message));
	},

	debug(message: unknown): void {
		logger.debug(String(message));
	},
};
