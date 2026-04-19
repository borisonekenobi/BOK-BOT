import * as winston from 'winston';

const date_ob = new Date();
const year = date_ob.getFullYear();
const month = (`0${date_ob.getMonth() + 1}`).slice(-2);
const date = (`0${date_ob.getDate()}`).slice(-2);
const hours = date_ob.getHours();
const minutes = date_ob.getMinutes();
const seconds = date_ob.getSeconds();
const logFile = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}.log`;

const fileFormat = winston.format.combine(winston.format.timestamp(),
	winston.format.printf(({timestamp, level, message, app, ...meta}) => {
		const metaString = Object.keys(meta).length ?
			` ${JSON.stringify(meta)}` :
			'';
		return `${timestamp} [${app}] ${level}: ${message}${metaString}`;
	}));

// const consoleFormat = winston.format.combine(
// 	winston.format.colorize({all: true}),
// 	winston.format.printf(({level, message}) => `${level}: ${message}`)
// );

const logger = winston.createLogger({
	level: 'debug',
	defaultMeta: {app: 'BOK-BOT'},
	transports: [
		new winston.transports.File({
			filename: `logs/${logFile}`, format: fileFormat,
		}), new winston.transports.Console({
			format: winston.format.cli(),
		})],
});

export const log = {
	error(message: any): void {
		logger.error(String(message));
	},

	warn(message: any): void {
		logger.warn(String(message));
	},

	info(message: any): void {
		logger.info(String(message));
	},

	verbose(message: any): void {
		logger.verbose(String(message));
	},

	debug(message: any): void {
		logger.debug(String(message));
	},
};
