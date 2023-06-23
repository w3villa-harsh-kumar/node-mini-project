const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    if (err instanceof CustomAPIError) {
        return res
            .status(err.statusCode)
            .json({ msg: err.message, success: false });
    }
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            err: err,
            msg: "Something went wrong, please try again",
            success: false,
        });
};

module.exports = errorHandlerMiddleware;
