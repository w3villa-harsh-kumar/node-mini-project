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

/**
 * @swagger
 * paths:
 *   /api/v1/users/register:
 *     post:
 *       summary: Register User
 *       tags:
 *         - User
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: register a new user
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

router.post("/register", validator(registerValidations, "body"), register);

/**
 * @swagger
 * paths:
 *   /api/v1/users/login:
 *     post:
 *       summary: Login User
 *       tags:
 *         - User
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: register a new user
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

router.post("/login", validator(loginValidations, "body"), login);

/**
 * @swagger
 * paths:
 *   /api/v1/users/forget-password:
 *     post:
 *       summary: Forget Password
 *       tags:
 *         - User
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: Forget Password
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

router.post(
    "/forget-password",
    validator(forgetPasswordValidations, "body"),
    forgotPassword
);

/**
 * @swagger
 * paths:
 *   /api/v1/users/reset-password:
 *     post:
 *       summary: Reset Password
 *       tags:
 *         - User
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           description: Reset Password
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *               - token
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               token:
 *                 type: string
 *       responses:
 *         200:
 *           description: Created
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

router.post(
    "/reset-password",
    validator(resetPasswordValidations, "body"),
    resetPassword
);

module.exports = router;
