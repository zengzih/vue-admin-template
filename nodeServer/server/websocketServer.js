/* const WebSocketServer = require('websocket').server

const http = require('http')
const server = http.createServer((request, response) => {
  // 处理HTTP请求
  console.log(request, response)
})

server.listen(8080, () => {
  console.log(`Server is listening on port 8080`)
})

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: true // 是否自动接受连接
})

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin)
  console.log('Connection accepted.')

  // 处理WebSocket消息
  connection.on('message', (message) => {
    console.log('message:', message)
    if (message.type === 'utf8') {
      console.log(`Received message: ${message.utf8Data}`)
      connection.sendUTF(`You said: ${message.utf8Data}`)
    }
  })

  // 处理WebSocket连接关闭
  connection.on('close', (reasonCode, description) => {
    console.log(`Connection closed with code ${reasonCode} and description ${description}`)
  })
}) */

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
})
console.log(wss)
module.exports = wss
