const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/user.model");
const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");

module.exports = {
    register: async (req, res, next) => {
        try {
            /**
                #swagger.summary = 'Register a new user'
                #swagger.tags = ['User']
                #swagger.description = 'Endpoint to register a new user'
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'User information.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/User" }
                }
            */
            // check if user exists
            const user = await User.findOne({ email: req.body.email });

            /**
              #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'Bad request'
                }
            */
            if (user) {
                throw new BadRequestError(
                    "User with this email already exists"
                );
            }

            // create new user
            const newUser = await User.create(req.body);
            const token = newUser.generateAuthToken();

            // send back token
            /* 
                #swagger.responses[201] = {
                    schema: { $ref: "#/definitions/AuthResponse" },
                    description: 'User registered successfully'
                }
            */
            res.status(StatusCodes.CREATED).json({
                username: newUser.username,
                success: true,
                token,
                msg: "User created succesfully",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            /**
                #swagger.summary = 'Login a user'
                #swagger.tags = ['User']    
                #swagger.description = 'Endpoint to login a user'
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'User credentials.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/Login" }
                }
            */

            const { email, password } = req.body;

            // check if user exists
            const user = await User.findOne({ email });

            /**
                #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'Invalid credentials'
                }
            */
            if (!user || !(await user.comparePassword(password))) {
                throw new BadRequestError("Invalid credentials");
            }

            // create token
            const token = user.generateAuthToken();

            // send back token
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/AuthResponse" },
                    description: 'User logged in successfully'
                }
            */
            res.status(StatusCodes.OK).json({
                username: user.username,
                success: true,
                token,
                msg: "User logged in succesfully",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            /**
              #swagger.summary = 'Send reset password token to email'
               #swagger.tags = ['User']
                #swagger.description = 'Endpoint to send reset password token to email'
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'User email.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/ForgetPassword" }
                }
            */
            // check if user exists
            const { email } = req.body;
            const user = await User.findOne({ email });

            /**
                #swagger.responses[404] = {
                    schema: { $ref: "#/definitions/NotFound" },
                    description: 'User does not exist'
                }
            */
            if (!user) {
                throw new NotFoundError("User does not exist");
            }

            // create token
            let token = user.forgetPasswordToken || uuid();

            // check if token already sent
            /**
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/ForgetPasswordResponse" },
                    description: 'Here is our onetime token to reset password'
                }
            */
            if (user.forgetPasswordToken) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    token,
                    msg: "Here is our onetime token to reset password",
                });
            }

            // update user
            user.forgetPasswordToken = token;
            await user.save();

            // send back token
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/AuthResponse" },
                    description: 'Reset password token sent to email'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                token,
                msg: "Reset password token sent to email",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            /**
                #swagger.summary = 'Reset password of a user'
                #swagger.tags = ['User']
                #swagger.description = 'Endpoint to reset password'
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'User token and password.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/ResetPassword" }
                }
            */
            const { token, password } = req.body;

            // check if token exists
            /**
                #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'Invalid token'
                }
            */
            if (!token) {
                throw new BadRequestError("Invalid token");
            }

            // check if user exists
            const user = await User.findOne({ forgetPasswordToken: token });

            /**
                #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'User does not exist'
                }
            */
            if (!user) {
                throw new BadRequestError("User does not exist");
            }

            // check whether the password is same as old password
            /**
                #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'Password cannot be same as old password'
                }
            */
            if (await user.comparePassword(password)) {
                throw new BadRequestError(
                    "Password cannot be same as old password"
                );
            }

            // update user
            user.password = password;
            user.forgetPasswordToken = null;
            await user.save();

            // send back token
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/ResetPasswordResponse" },
                    description: 'Password reset succesfully'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                msg: "Password reset succesfully",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    getProfile: async (req, res, next) => {
        /* 
            #swagger.summary = 'Get user profile'
            #swagger.tags = ['User']
            #swagger.description = 'Endpoint to get user profile'
        */
        try {
            // get user
            const user = await User.findById(req.user._id).select(
                "-password -__v -forgetPasswordToken"
            );

            // send back user
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/User" },
                    description: 'User profile'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                user,
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },
};
