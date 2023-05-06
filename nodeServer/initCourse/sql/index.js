const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : '11',
    port     : '3306',
    user     : 'root',
    password : 'zzh@WW446820',
    database : 'xuexitongV2'
});

connection.connect();
module.exports = connection
