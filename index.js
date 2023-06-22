require("dotenv").config();
require("express-async-errors");

const cors = require("cors");

const connectMongoDB = require("./db/db.connect");

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

const express = require("express"); 
const app = express();
const PORT = process.env.PORT || 3000;

// express middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
