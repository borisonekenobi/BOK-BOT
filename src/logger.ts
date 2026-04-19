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

const logger = winston.createLogger({
	level: 'debug', defaultMeta: {app: 'BOK-BOT'}, transports: [
		new winston.transports.File({
			filename: `logs/${logFile}`, format: fileFormat,
		}), new winston.transports.Console({
			format: winston.format.cli(),
		})],
});

export const log = {
	emerg(message: any): void {
		logger.emerg(String(message));
	},

	alert(message: any): void {
		logger.alert(String(message));
	},

	crit(message: any): void {
		logger.crit(String(message));
	},

	error(message: any): void {
		logger.error(String(message));
	},

	warning(message: any): void {
		logger.warning(String(message));
	},

	notice(message: any): void {
		logger.notice(String(message));
	},

	info(message: any): void {
		logger.info(String(message));
	},

	debug(message: any): void {
		logger.debug(String(message));
	},
};
