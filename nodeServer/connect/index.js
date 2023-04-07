const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zzh446820',
  database: 'xuexitong'
})

connection.connect()
module.exports = connection
