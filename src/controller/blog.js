const {exec, escape} = require('../db/mysql')
const xss = require('xss')
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
      author = escape(author)
      sql += `and author=${author} `
  }
  if (keyword) {
      keyword = escape('%' + keyword + '%')
      sql += `and title like ${keyword} `
  }
  sql += `order by createtime desc;`
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `select * from blogs where 1=1 `
  if (id) {
    sql += `and id='${id}' `
  }
  return exec(sql).then(row => {
    return row[0]
  })
}

const newBlog = (blogData) => {
  const title = xss(blogData.title)
  const content = blogData.content
  const author = blogData.author
  const createtime = Date.now()
  let sql = `insert into blogs (title, content, author, createtime) 
  values ('${title}', '${content}', '${author}', '${createtime}');`
  return exec(sql).then(result => {
    return {
      id: result.insertId
    }
  })
}

const updateBlog = (id, blogData) => {
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  let sql = `update blogs set title='${title}', content='${content}' where id='${id}'`
  return exec(sql).then(result => {
    return {
      result: result.affectedRows > 0
    }
  })
}

const delBlog = (id, author) => {
  let sql = `delete from blogs where id=${id} and author='${author}'`
  return exec(sql).then(result => {
    return {
      result: result.affectedRows > 0
    }
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}