const path = require('path')
const fs = require('fs')

// 写log
function writeLog(writeStream, log){
  writeStream.write(log + '\n')
}

// 生成write stream
function createWriteStream(filename) {
  const fullName = path.join(__dirname, '../', '../', 'logs/', filename)
  const writeStream = fs.WriteStream(fullName, {
    flages: 'a'
  })
  return writeStream
}

// accsess log
const accessWriteStream = createWriteStream('access.log')
function access(log) {
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}