var fs = require('fs');
var SQL = require('sql.js');


var filebuffer = fs.readFileSync('test.sqlite');

// Load the db
var db = new SQL.Database(filebuffer);
if(db) {
	console.log("connect to db");
} else {
	console.log("connect to db failed .");
}

var res = db.exec("SELECT * FROM nodes");
console.log(res);