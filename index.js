require("dotenv").config();
require("express-async-errors");
const { StatusCodes } = require("http-status-codes");

// security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// database connection
const connectMongoDB = require("./db/db.connect");

// Logger
const logger = require("./loggers");
const { httpLogger, errorHttpLogger } = require("./loggers/httpLogger");

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger/swagger.json");

// error handler
const { AnonmyousError } = require("./errors");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// routes
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");

// Express App
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const limiter = rateLimit({
    windowMs: 15 * Number(process.env.RATE_LIMIT_WINDOW_MS),
    max: Number(process.env.RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res, next) {
        logger.error(`Too many requests from ${req.ip} at ${req.originalUrl}`);
        throw new AnonmyousError(
            `Too many requests, please try again in ${Math.round(
                this.windowMs / process.env.RATE_LIMIT_WINDOW_MS
            )} minutes`,
            StatusCodes.TOO_MANY_REQUESTS
        );
    },
});
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
};
app.set("trust proxy", Number(process.env.TRUST_PROXY));
// app.use(limiter);
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(errorHttpLogger);

// Home Route
app.get("/", (req, res) => {
    /*
        #swagger.tags = ['Home']
        #swagger.description = 'Endpoint to Home route  of the APIs'
    */
    res.send("welcome to task manager api");
});

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

// API Routes
app.use(`/api/v1/users`, limiter, userRoutes);
app.use(`/api/v1/tasks`, taskRoutes);

// Error handling middlewareI
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Listen to port
app.listen(PORT, async () => {
    try {
        await connectMongoDB();
        logger.info(`MongoDB connected`);
        logger.info(`Example app listening at http://localhost:${PORT}`);
    } catch (error) {
        logger.error(`Error in Connecting Database ${error.toString()}`);
        process.exit(1);
    }
});

module.exports = app;