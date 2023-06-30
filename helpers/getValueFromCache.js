const myCache = require("../cache");
const checkInCache = require("./checkInCache");

const getValueFromCache = async (key, status) => {
    // check if the key exists in cache or not
    const isKeyExists = await checkInCache(key);

    // if key exists in cache then return the value
    if (isKeyExists) {
        const value = myCache.get(key);
        return JSON.parse(value);
    }

    // if key does not exists in cache then return null
    return null;
}

module.exports = getValueFromCache;