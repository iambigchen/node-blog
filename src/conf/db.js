const env = process.env.NODE_ENV

let MYSQL_CONF
let REDIS_CONF
if (env === 'dev') {
   // mysql1
   MYSQL_CONF = {
      host: '127.0.0.1',
      user: 'root',
      password: 'ab159951',
      port: '3306',
      database: 'myblog'
  }
  //redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: '127.0.0.1',
    user: 'root',
    password: 'ab159951',
    port: '3306',
    database: 'myblog'
  }
  //redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}