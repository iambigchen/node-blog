const {exec, escape} = require('../db/mysql')
const genPassword = require('../utils/cryp')
const login = (username, password) => {
  username = escape(username)
  password = genPassword(password)
  // password = escape(password)
  const sql = `
      select userName from users where userName=${username} and password='${password}'
    `
  return exec(sql).then(rows => {
    console.log(234, rows)
    return rows[0] || {}
  })
}

module.exports = {
  login
}