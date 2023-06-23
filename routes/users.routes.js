const {
    register,
    login,
    forgotPassword,
    resetPassword,
} = require(`../controllers/${process.env.API_VERSION}/users.controller`);

const {
    registerValidations,
    loginValidations,
    forgetPasswordValidations,
    resetPasswordValidations,
} = require(`../validations/users.validations`);

const validator = require("../middlewares/validator");

const router = require("express").Router();

// Auth Routes
router.post("/register", validator(registerValidations, "body"), register);
router.post("/login", validator(loginValidations, "body"), login);
router.post(
    "/forget-password",
    validator(forgetPasswordValidations, "body"),
    forgotPassword
);
router.post(
    "/reset-password",
    validator(resetPasswordValidations, "body"),
    resetPassword
);

module.exports = router;
