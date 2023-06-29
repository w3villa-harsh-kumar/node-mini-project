const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const logger = require("../loggers");
const errorHandlerMiddleware = (err, req, res, next) => {
    logger.error(err);
    logger.error(err.stack);

    // Check if error is a custom error
    if (err instanceof CustomAPIError) {
        return res
            .status(err.statusCode)
            .json({ msg: err.message, success: false });
    }

    // If not a custom error, send generic error
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            msg: "Something went wrong, please try again",
            success: false,
        });
};

module.exports = errorHandlerMiddleware;
