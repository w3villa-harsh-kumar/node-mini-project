require("dotenv").config();
const { productionLogger, developmentLogger } = require("./loggers");

let logger = null;

if (process.env.NODE_ENV !== "production") {
    logger = developmentLogger();
} else {
    logger = productionLogger();
}

module.exports = logger;
