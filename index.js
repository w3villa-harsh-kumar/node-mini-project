require("dotenv").config();
require("express-async-errors");

// database connection
const connectMongoDB = require("./db/db.connect");

// routes
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");

// error handler
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use(`/api/${process.env.API_VERSION}/users`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/tasks`, taskRoutes);

// Error Handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, async () => {
    try {
        await connectMongoDB();
        console.log(`MongoDB connected`);
        console.log(`Example app listening at http://localhost:${PORT}`);
    } catch (error) {
        console.log("Error in Connecting Database", error.toString());
        process.exit(1);
    }
});
