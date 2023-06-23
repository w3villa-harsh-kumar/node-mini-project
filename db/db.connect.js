const mongoose = require("mongoose");

const dbConfig = require("../config/db.config");

const connectMongoDB = () => {
    // Local
    return mongoose.connect(
        `mongodb://${dbConfig.local.HOST}:${dbConfig.local.PORT}/${dbConfig.local.DB}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    // Atlas
    // return mongoose.connect(`mongodb://${dbConfig.local.HOST}:${dbConfig.local.PORT}/${dbConfig.local.DB}`, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useFindAndModify: false,
    //     useCreateIndex: true,
    // });
};

module.exports = connectMongoDB;
