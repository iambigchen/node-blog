const http = require('http')
const serverHandle = require('../app')
const PORT = 8001

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
  console.log(`server success in ${PORT}`)
})