const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present
  /*
      #swagger.responses[401] = {
          schema: { $ref: "#/definitions/Unauthenticated" },
          description: 'Authentication invalid'
      }
  */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  // Get token
  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticate;
