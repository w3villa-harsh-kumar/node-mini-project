const morgan = require("morgan");
const { StatusCodes } = require("http-status-codes");
const logger = require("./index");

const morganOptions = {
    skip: (req, res) => process.env.NODE_ENV === "test",
    stream: {
        write:
            process.env.NODE_ENV === "production"
                ? (message) => logger.info(message.trim())
                : (message) => logger.http(message.trim()),
    },
};

const successResponseFormat = (tokens, req, res) => {
    const { method, url, status } = tokens;
    return [
        `[${method(req, res)}]`,
        `[${url(req, res)}]`,
        `[${status(req, res)}]`,
        `[${tokens["response-time"](req, res)} ms]`,
    ].join(" ");
};

const errorResponseFormat = (tokens, req, res) => {
    const { method, url, status } = tokens;
    return [
        `[${method(req, res)}]`,
        `[${url(req, res)}]`,
        `[${status(req, res)}]`,
        `[${tokens["response-time"](req, res)} ms] `,
    ].join(" ");
};

const successResponsePredicate = (req, res) =>
    res.statusCode < StatusCodes.BAD_REQUEST;
const errorResponsePredicate = (req, res) =>
    res.statusCode >= StatusCodes.BAD_REQUEST;

const httpLogger = morgan(successResponseFormat, {
    ...morganOptions,
    skip: (req, res) => !successResponsePredicate(req, res),
});

const errorHttpLogger = morgan(errorResponseFormat, {
    ...morganOptions,
    skip: (req, res) => !errorResponsePredicate(req, res),
    stream: {
        write: (message) => logger.error(message.trim()),
    },
});

module.exports = {
    httpLogger,
    errorHttpLogger,
};
