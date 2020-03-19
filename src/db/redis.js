const redis = require('redis')

const {REDIS_CONF} = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', (err) => {
  console.error(err)
})

const set = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  console.log('redis', key, val)
  redisClient.set(key, val)
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      if (val === null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  get,
  set
}