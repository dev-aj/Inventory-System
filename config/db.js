const mysql = require('mysql');
const config = require('config');

const conn = mysql.createConnection({
  host: config.get('dbhost'),
  user: config.get('dbuser'),
  port: config.get('dbport'),
  password: config.get('dbpassword'),
  insecureAuth: true,
  database: config.get('database'),
});

//connect to database
const connectDB = () =>
  conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
  });

module.exports = { connectDB, conn };
