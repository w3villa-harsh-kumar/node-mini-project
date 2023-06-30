require("dotenv").config();
require("express-async-errors");

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger/swagger.json");

// database connection
const connectMongoDB = require("./db/db.connect");

// Logger
const logger = require("./loggers");
const { httpLogger, errorHttpLogger } = require("./loggers/httpLogger");

// error handler
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// routes
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// express middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
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
app.use(`/api/v1/users`, userRoutes);
app.use(`/api/v1/tasks`, taskRoutes);

// Error handling middleware
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