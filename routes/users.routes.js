const {
    register,
    login,
    forgotPassword,
    resetPassword,
} = require(`../controllers/v1/users.controller`);

const {
    registerValidations,
    loginValidations,
    forgetPasswordValidations,
    resetPasswordValidations,
} = require(`../validations/users.validations`);

const validator = require("../middlewares/validator");

const router = require("express").Router();

// Auth Routes

/**
 * Route for user registration
 * @route POST /api/v1/users/register
 */
router.post("/register", validator(registerValidations, "body"), register);

/**
 * Route for user login
 * @route POST /api/v1/users/login
 */
router.post("/login", validator(loginValidations, "body"), login);

/**
 * Route for user forgot password
 * @route POST /api/v1/users/forget-password
 */
router.post(
    "/forget-password",
    validator(forgetPasswordValidations, "body"),
    forgotPassword
);

/**
 * Route for user reset password
 * @route POST /api/v1/users/reset-password
 */
router.post(
    "/reset-password",
    validator(resetPasswordValidations, "body"),
    resetPassword
);

module.exports = router;
