const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const { getValueFromCache, setValueInCache } = require("../helpers");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Check if authorization header is present
    /*
    #swagger.responses[401] = {
      schema: { $ref: "#/definitions/Unauthenticated" },
      description: 'Authentication invalid'
    }
    */
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
     throw new UnauthenticatedError("Not authorized to access this route");
    }
    
    // Get token
    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new UnauthenticatedError("Not authorized to access this route");
    }
    console.log(token);

    try {
        // Verify token
        const verfiedToken = await getValueFromCache(token);
        if (verfiedToken) {
            console.log("Main yha hu");
            console.log(verfiedToken);
            req.user = verfiedToken;
            return next();
        } else {
            console.log("Main yha nhi hu");
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // Check if decoded token is present
            console.log(decoded);
            if (!decoded?._id) {
                throw new UnauthenticatedError("Authorization invalid");
            }

            // check if user exists
            const user = await User.findOne({ _id: decoded._id });
            if (!user) {
                throw new UnauthenticatedError("Authorization invalid");
            }

            req.user = decoded;
            await setValueInCache(token, decoded, 60 * 60);
            next();
        }
    } catch (error) {
      console.log(error);
        throw new UnauthenticatedError("Not authorized to access this route");
    }
};

module.exports = authenticate;
