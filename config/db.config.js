// MongoDB Db Configuration
require("dotenv").config();

module.exports = {
  local: {
    HOST: process.env.MONGODB_LOCAL_HOST,
    PORT: process.env.MONGODB_LOCAL_PORT,
    DB: process.env.MONGODB_LOCAL_DB,
  },
  atlas: {
    HOST: process.env.MONGODB_ATLAS_HOST,
    PORT: process.env.MONGODB_ATLAS_PORT,
    DB: process.env.MONGODB_ATLAS_DB,
    USERNAME: process.env.MONGODB_ATLAS_USERNAME,
    PASSWORD: process.env.MONGODB_ATLAS_PASSWORD,
    OPTIONS: process.env.MONGODB_ATLAS_OPTIONS,
  },
};
 