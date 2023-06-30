const myCache = require("../cache");

const checkInCache = async (key) => {
    return myCache.has(key) ? true : false;
};

module.exports = checkInCache;