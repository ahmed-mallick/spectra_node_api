const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");

const env = process.env.NODE_ENV || "development";
const logDir = `${process.cwd()}/logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

//const dailyRotateFileTransport = new transports.DailyRotateFile({
//  filename: `${logDir}/log-%DATE%.log`,
//  datePattern: "YYYY-MM-DD",
//  maxFiles: "7d",
//  maxsize: "50m",
//});
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/log-%DATE%-${process.pid}.log`,
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
  maxSize: "300m",
  zippedArchive: true
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: () => new Date()
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    dailyRotateFileTransport,
  ],
});
module.exports = logger;
