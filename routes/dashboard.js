const express = require('express');
const mysql = require('mysql');
const router = express.Router(); //so that we can use the 'router'
const config = require('../config');
const mysqlConfig = config.mysqlConfig;
//var connection = mysql.createConnection(mysqlConfig);

// console.log(mysqlConfig); //testing config import

//New member join request through POST with variables 'jointype, user_id, user_pw, name, cellphone' in json.

router.get('/', function(req, res, next){
	// TODO : if() if not logged in, send alert and redirect
	res.render('dashboard', {title: '배송조회 서비스'});
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


module.exports = router; // sets a single "router" object to export and expose to global namespace where it's called.
// Same as exports = router;
// below is similar, but you'll have to do
// const dashboard = require('./routes/dashboard'); app.use('/dashboard',dashboard.router);
// module.exports.router = router;
// Also same as module.exports = {router: router};