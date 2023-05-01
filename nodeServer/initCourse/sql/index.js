/*
const mysql = require('mysql');
/!*
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'zzh446820',
    database : 'xuexitong'
});
*!/
const db_config = {
  host     : 'localhost',
  user     : 'root',
  password : 'zzh446820',
  database : 'xuexitong'
};


function handleDisconnect() {
  console.log(223333)
  const connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('连接成功')
    }
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
  return connection;
}

const connection = handleDisconnect()
connection.connect()
module.exports = connection
*/
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'zzh446820',
  database : 'xuexitong'
});

connection.connect();
module.exports = connection
