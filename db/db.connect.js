const mongoose = require("mongoose");

const dbConfig = require("../config/db.config");

const connectMongoDB = () => {
    // Test MongoDB
    if (process.env.NODE_ENV === "test")
        return mongoose.connect(
            `mongodb://${dbConfig.test.HOST}:${dbConfig.test.PORT}/${dbConfig.test.DB}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

    // Local MongoDB
    if (process.env.NODE_ENV === "development")
        return mongoose.connect(
            `mongodb://${dbConfig.development.HOST}:${dbConfig.development.PORT}/${dbConfig.development.DB}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

    // Atlas MongoDB (Production)
    if (process.env.NODE_ENV === "production")
        return mongoose.connect(
            `mongodb://${dbConfig.atlas.USERNAME}:${dbConfig.atlas.PASSWORD}@${dbConfig.atlas.HOST}:${dbConfig.atlas.PORT}/${dbConfig.atlas.DB}?${dbConfig.atlas.OPTIONS}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
};

module.exports = connectMongoDB;
