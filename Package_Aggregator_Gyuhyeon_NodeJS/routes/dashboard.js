var express = require('express');
var mysql = require('mysql');
var router = express.Router(); //so that we can use the 'router'
var mysqlConfig = {
	'host' : 'url from external file',
	'user' : 'id from external file', 'password' : 'pw from external file', 'database' : 'dbname',
}
//var connection = mysql.createConnection(mysqlConfig);

//New member join request through POST with variables 'jointype, user_id, user_pw, name, cellphone' in json.

router.get('/', function(req, res, next){
    res.send("Site under construction here");
});

router.post('/', function(req, res, next){
	/* for reference, example of making insert query to db
	if(req.body.jointype=='teacher'){
		connection.query('INSERT INTO TEACHER(user_id, user_pw, name, cellphone) VALUES (?,?,?,?);',
			[req.body.user_id, req.body.user_pw, req.body.name, req.body.cellphone],
			function(error, info){
				if (error == null){
					connection.query('SELECT * from TEACHER WHERE u_id=?;', [info.insertId], function(error, cursor){
						if(cursor.length>0){

						}
					});
				}
			});
	}
	else if(req.body.jointype=='parent'){

	}
	*/
});

router.post('/testpostrequest', function(req, res, next){
	res.json({result:true, time:new Date()});
});


module.exports = router; //sets a single "router" object to export and expose to global namespace where it's called.
//Same as exports = router;
//Same as module.exports.router = router;
//Also same as module.exports = {router: router};