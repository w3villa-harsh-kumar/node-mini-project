const Joi = require("joi");

module.exports = {
    registerValidations: Joi.object({
        name: Joi.string().required().min(3).max(30).messages({
            "string.base": `Name should be a type of 'text'`,
            "string.empty": `Name cannot be an empty field`,
            "string.min": `Name should have a minimum length of {#limit}`,
            "string.max": `Name should have a maximum length of {#limit}`,
            "any.required": `Name is a required field`,
        }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Email must be a valid email",
                "string.empty": "Email is a required field",
                "any.required": "Email is a required field",
            })
            .example("example@gmail.com"),
        password: Joi.string()
            .pattern(new RegExp("^[A-Za-z0-9@]{3,30}$"))
            .required()
            .min(6)
            .max(16)
            .messages({
                "string.pattern.base":
                    "Password must contain only alphanumeric characters and @",
                "string.base": `Password is a required field`,
                "string.empty": `Password should not be empty`,
                "string.min": `Password should have a minimum length of {#limit}`,
                "string.max": `Password should have a maximum length of {#limit}`,
                "any.required": `Password is a required field`,
            })
            .example("example@123"),
        phoneNumber: Joi.string()
            .pattern(new RegExp("^[0-9]{10}$"))
            .required()
            .min(10)
            .max(10)
            .messages({
                "string.pattern.base": "Phone Number must contain only numbers",
                "string.base": `Phone Number is a required field`,
                "string.empty": `Phone Number should not be empty`,
                "string.min": `Phone Number should have a minimum length of {#limit}`,
                "string.max": `Phone Number should have a maximum length of {#limit}`,
                "any.required": `Phone Number is a required field`,
            })
            .example("1234567890"),
    }),

    loginValidations: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Email must be a valid email",
                "string.empty": "Email is a required field",
                "any.required": "Email is a required field",
            })
            .example("example@gamil.com"),
        password: Joi.string()
            .pattern(new RegExp("^[A-Za-z0-9@]{3,30}$"))
            .required()
            .min(6)
            .max(16)
            .messages({
                "string.pattern.base":
                    "Password must contain only alphanumeric characters and @",
                "string.base": `Password is a required field`,
                "string.empty": `Password should not be empty`,
                "any.required": `Password is a required field`,
                "string.min": `Password should have a minimum length of {#limit}`,
                "string.max": `Password should have a maximum length of {#limit}`,
            })
            .example("example@123"),
    }),
    forgetPasswordValidations: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Email must be a valid email",
                "string.empty": "Email is a required field",
                "any.required": "Email is a required field",
            })
            .example("example@gamil.com"),
    }),
    resetPasswordValidations: Joi.object({
        password: Joi.string()
            .pattern(new RegExp("^[A-Za-z0-9@]{3,30}$"))
            .required()
            .min(6)
            .max(16)
            .messages({
                "string.pattern.base":
                    "Password must contain only alphanumeric characters and @",
                "string.base": `New Password is a required field`,
                "string.empty": `New Password should not be empty`,
                "any.required": `New password is a required field`,
                "string.min": `New Password should have a minimum length of {#limit}`,
                "string.max": `New Password should have a maximum length of {#limit}`,
            })
            .example("example@123"),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref("password"))
            .messages({
                "any.only": "Confirm Password must match with Password",
                "string.base": `Confirm Password is a required field`,
                "string.empty": `Confirm Password should not be empty`,
                "any.required": `Confirm Password is a required field`,
            }),
        token: Joi.string().guid({ version: "uuidv4" }).required().messages({
            "string.guid": "Token must be a valid token",
            "string.empty": "Token is a required field",
            "any.required": "Token is a required field",
        }),
    }),
};
