const redis = require('redis')
const {
    REDIS_CONF
} = require('../conf/db')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', (err) => {
    console.log(err)
})


function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err)
                return
            }
            try {
                resolve(
                    JSON.parse(value)
                )
            } catch (err) {
                resolve(value)
            }
        })
    })
}

function set(key, value, refer, aryv) {
    if (typeof value == "object") {
        value = JSON.stringify(value)
    }
    if (refer) {
        redisClient.set(key, value, refer, aryv)
    } else {
        redisClient.set(key, value)
    }
}

module.exports = {
    get,
    set
}