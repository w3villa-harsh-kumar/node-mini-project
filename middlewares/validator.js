const { AnonmyousError } = require("../errors");

// Validate request body and query against a Joi schema
const validator = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate({ ...req[property] });
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i) => i.message).join(",");
            throw new AnonmyousError(message, 422);
        }
    };
};

module.exports = validator;
