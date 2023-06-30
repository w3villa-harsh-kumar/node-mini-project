const myCache = require("../cache");
const checkInCache = require("./checkInCache");
const getValueFromCache = require("./getValueFromCache");

const setValueInCache = async (key, value) => {
    // check if the key exists in cache or not
    const isKeyExists = await checkInCache(key);

    // if key exists in cache then check if the value is same or not
    if (isKeyExists) {
        const cachedValue = await getValueFromCache(key);
        if (cachedValue === value) {
            return;
        }
        myCache.del(key);
    }

    // set value in cache
    myCache.set(key, JSON.stringify(value));
};

module.exports = setValueInCache;
