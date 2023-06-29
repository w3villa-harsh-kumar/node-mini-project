require("dotenv").config();
const { createLogger, format, transports, level } = require("winston");
const { combine, timestamp, label, printf, colorize } = format;

const options = {
    file: {
        level: "info",
        filename: process.env.LOG_FILE,
        handleExceptions: true,
        json: true,
        maxsize: process.env.LOG_FILE_MAX_SIZE,
        maxFiles: process.env.LOG_FILE_MAX_FILES,
        colorize: false,
    },
    console: { 
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const myFormat = printf(
    ({
        level,
        message,
        timestamp,
    }) => {
        return `[${timestamp}] [${level}]: ${message}`;
    }
); 

module.exports = {
    productionLogger: () => {
        return createLogger({
            level: process.env.LOG_LEVEL_PROD,
            format: combine(timestamp(), myFormat),
            transports: [new transports.File(options.file)],
        });
    },

    developmentLogger: () => {
        return createLogger({
            level: process.env.LOG_LEVEL_DEV,
            format: combine(
                colorize(), // colorize the output to the console, use with Console transport
                timestamp({ format: "HH:mm:ss YYYY-MM-DD" }),
                myFormat
            ),
            transports : [
                // new transports.File(options.file),
                new transports.Console(options.console)
            ]
        });
    }, 
};
