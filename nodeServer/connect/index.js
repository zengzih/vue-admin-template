const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zzh446820',
  database: 'xuexitongV2'
})

connection.connect()
module.exports = connection
