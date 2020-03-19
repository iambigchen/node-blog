const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')


const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleBolgRouter = (req, res) => {
  const method = req.method

  const id = req.query.id || ''

  //获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const keyword = req.query.keyword || ''
    const author = req.query.author || ''
    return getList(author, keyword).then(listdata => {
      return new SuccessModel(listdata)
    })
  }

  //获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id || ''
    return getDetail(id).then(detailData => {
      return new SuccessModel(detailData)
    })
  }

  //新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const blogData = req.body || ''
    blogData.author = req.session.username
    return newBlog(blogData).then(newResult => {
      return new SuccessModel(newResult)
    })
  }

  //更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const blogData = req.body || {}
    return updateBlog(id, blogData).then(updateResult => {
      return new SuccessModel(updateResult)
    })
  }

  //删除博客
  if (method === 'POST' && req.path === '/api/blog/delete') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      return loginCheckResult
    }
    const author = req.session.username
    return delBlog(id, author).then(delResult => {
      return new SuccessModel(delResult)
    })
  }
}

module.exports = handleBolgRouter