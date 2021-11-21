const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

var sql = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  dateStrings:true,
  multipleStatements: true
});



// sql.connect((err) => {
//   if (err) {
//     console.log("Database Connection Failed !!!", err);
//     return;
//   }

//   console.log("We are connected to gfg_db database");

//   // This query will be used to select columns
//   let query = 'SELECT * FROM user';

//   sql.query(query, (err, rows) => {
//       if(err) throw err;

//       console.log(rows);
//   });
// });

module.exports = sql;
