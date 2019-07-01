const env = process.env.NODE_ENV

let MY_SQL_CONF = {
    development: {
        host: '127.0.0.1',
        user: 'root',
        password: 'ta1314520',
        port: '3306',
        database: 'sparkblog'
    },
    production: {
        host: 'localhost',
        user: 'root',
        password: 'ta1314520',
        port: '3306',
        database: 'sparkblog'
    }
} [env]

let REDIS_CONF = {
    development: {
        port: 6379,
        host: '127.0.0.1'
    },
    production: {
        port: 6379,
        host: '127.0.0.1'
    }
} [env]

module.exports = {
    MY_SQL_CONF,
    REDIS_CONF
}