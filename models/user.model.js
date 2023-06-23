const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        forgetPasswordToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// hash password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    }
});

// generate auth token
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: process.env.JWT_ALGORITHM,
        }
    );
    return token;
};

// compare password
userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", userSchema);
