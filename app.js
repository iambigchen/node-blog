const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const {access} = require('./src/utils/log')
const {get, set} = require('./src/db/redis')

const env = process.env.NODE_ENV

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
}
const serverHandle = (req, res) => {
  // access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  const url = req.url
  req.path = url.split('?')[0]

  // 设置返回格式
  res.setHeader('Content-type', 'application/json')
  //解析query
  req.query = querystring.parse(url.split('?')[1])

  // 解析cookie
  req.cookie = {}
  const cookiestr = req.headers.cookie || ''
  cookiestr.split(';').forEach(item => {
    if (!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const value = arr[1].trim()
    req.cookie[key] = value
  })

  // 解析session
  let userId = req.cookie.userid
  let needSetCookie = false
  if (!userId) {
    needSetCookie = true
    userId = Date.now()
    set(userId, {})
  }
  req.sessionId = userId
  get(userId).then(session => {
    if (session === null) {
      session = {}
      set(userId, {})
    }
    req.session = session
    // 处理postData
    return getPostData(req) 
  }).then(postData => {
    req.body = postData
    // blog router
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }
    
    // user router
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中路由，返回 404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  })
}

module.exports = serverHandle