const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/user.model");
const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");

module.exports = {
    register: async (req, res, next) => {
        try {
            // check if user already exists
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                throw new BadRequestError(
                    "User with this email already exists"
                );
            }

            // create new user
            const newUser = await User.create(req.body);
            const token = newUser.generateAuthToken();

            // send back token
            res.status(StatusCodes.CREATED).json({
                username: newUser.username,
                success: true,
                token,
                msg: "User created succesfully",
            });
        } catch (err) {
            return next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // check if user exists
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                throw new BadRequestError("Invalid credentials");
            }

            // create token
            const token = user.generateAuthToken();

            // send back token
            res.status(StatusCodes.OK).json({
                username: user.username,
                success: true,
                token,
                msg: "User logged in succesfully",
            });
        } catch (err) {
            return next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            // check if user exists
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                throw new NotFoundError("User does not exist");
            }

            // create token
            let token = user.forgetPasswordToken || uuid();

            // check if token already sent
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
            res.status(StatusCodes.OK).json({
                success: true,
                token,
                msg: "Reset password token sent to email",
            });
        } catch (err) {
            return next(err);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, password } = req.body;
            if (!token) {
                throw new BadRequestError("Invalid token");
            }

            // check if user exists
            const user = await User.findOne({ forgetPasswordToken: token });
            if (!user) {
                throw new BadRequestError("User does not exist");
            }

            // check whether the password is same as old password
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
            res.status(StatusCodes.OK).json({
                success: true,
                msg: "Password reset succesfully",
            });
        } catch (err) {
            return next(err);
        }
    },
};
