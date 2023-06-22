const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class AnonmyousError extends CustomAPIError {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || StatusCodes.UNAUTHORIZED;
    }
}

module.exports = AnonmyousError;
