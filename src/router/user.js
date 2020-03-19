const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {set} = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method

  //登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const username = req.body.username
    const password = req.body.password
    return login(username, password).then(result => {
      if (result.userName) {
        // 操作session
        req.session.username = result.userName
        // req.session.realname = result.realname
        set(req.sessionId, req.session)
        return new SuccessModel(result)
      }
      return new ErrorModel('登录失败')
    })
  }

  // 登录测试
  if (method === 'GET' && req.path ===  '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel())
    }
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

module.exports = handleUserRouter