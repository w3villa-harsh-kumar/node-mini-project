const Joi = require("joi");

module.exports = {
    createTaskValidations: Joi.object({
        title: Joi.string().required().min(3).max(20).messages({
            "string.base": `Title should be a type of 'text'`,
            "string.empty": `Title cannot be an empty field`,
            "string.min": `Title should have a minimum length of {#limit}`,
            "string.max": `Title should have a maximum length of {#limit}`,
            "any.required": `Title is a required field`,
        }),

        description: Joi.string().required().min(3).max(100).messages({
            "string.base": `Description should be a type of 'text'`,
            "string.empty": `Description cannot be an empty field`,
            "string.min": `Description should have a minimum length of {#limit}`,
            "string.max": `Description should have a maximum length of {#limit}`,
            "any.required": `Description is a required field`,
        }),
    }),

    updateTaskValidations: Joi.object({
        title: Joi.string().min(3).max(20).messages({
            "string.base": `Title should be a type of 'text'`,
            "string.empty": `Title cannot be an empty field`,
            "string.min": `Title should have a minimum length of {#limit}`,
            "string.max": `Title should have a maximum length of {#limit}`,
        }),
        description: Joi.string().min(3).max(100).messages({
            "string.base": `Description should be a type of 'text'`,
            "string.empty": `Description cannot be an empty field`,
            "string.min": `Description should have a minimum length of {#limit}`,
            "string.max": `Description should have a maximum length of {#limit}`,
        }),
        completed: Joi.boolean().messages({
            "boolean.base": `Completed should be a type of 'boolean'`,
        }),
    }),

    idParamValidations: Joi.object({
        id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "string.pattern.base": `Id should be a valid mongo id`,
                "string.empty": `Id cannot be an empty field`,
                "any.required": `Id is a required field`,
            }),
    }),
};
