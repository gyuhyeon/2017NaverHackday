const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const twilio = require('twilio');
const mysql = require('mysql');
const config = require('../config');
const CJ = require('../crawlerAPI/CJ');
const KPOST = require('../crawlerAPI/KPOST');

const index = require('./routes/index');
const query = require('./routes/query');
const dashboard = require('./routes/dashboard');
const login = require('./routes/login');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
//querystring : false, qs library : true
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //the folder "public" should have the resources ejs templates will be using(js, css..)

// website routing(requests)
app.use('/', index); // show main landing page & search bar
app.use('/query', query); // query API

// not implemented. If implemented, this section would provide personalized dashboard to users
app.use('/dashboard', dashboard); // show user 'profiles'
app.use('/login', login); 


// twilio API impl.
var twclient = new twilio(config.twConfig.sid, config.twConfig.token);

function sendSMS(dest, msg){
    //send message
    twclient.messages.create({
        body: msg,
        to: '+82'+dest,
        from: '+12568184331'
    })
    .then((message) => console.log(message.sid));
}


// prepare to create connection
const mysqlConfig = config.mysqlConfig;
let connection;

//handleDisconnect keeps the mysql connection alive for this route
function handleDisconnect(){
    connection = mysql.createConnection(mysqlConfig);
    connection.connect(function(err){
        if(err){
            console.log("error connecting to db: ", err);
                setTimeout(handleDisconnect, 2000); // if connection was refused, try again in 2 seconds.
            }
        });
    connection.on('error', function(err){
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED'){
            handleDisconnect(); // connection lost to db. try connecting again.
        }
        else{
            //throw err;
        }
    });
}
handleDisconnect();


// always-looping service : check for updates for all pending delivery logs
let prevlog = {}; // { trackingnum: { companycode: XX, phonenum: XXX, history: string(json) }, trackingnum: {}... }
function checkUpdate() {
    try{
        // TODO : consider npm promise-mysql
        connection.query('SELECT * FROM DeliveryLog WHERE status != "배달완료" AND noti = "ON"', function (error, cursor) {
            if (error != null){
                console.log("DB query failed:");
                console.log(error);
            }
            else{ // fetched all entries that are pending
                let newlog = {};
                // for all entries, perform crawling.
                for (let i = 0; i < cursor.length; ++i) {
                    
                    if (prevlog[cursor[i].trackingnum] === undefined){
                        // there's no prevlog. This is new addition, so put it in global var prevlog for tracking.
                        // this only happens once.
                        prevlog[cursor[i].trackingnum] = {}; // new object.
                        prevlog[cursor[i].trackingnum].companycode = cursor[i].companycode;
                        prevlog[cursor[i].trackingnum].phonenum = cursor[i].phonenum;
                        // history is an array of objects. [{}, {}, {}]. Use JSON.stringify when storing in DB,
                        // Use JSON.parse when fetching and interpreting from DB. that will change it to Javascript Object.
                        prevlog[cursor[i].trackingnum].history = JSON.parse(cursor[i].history);
                    }
                    // in newlog, put in the current history at key "trackingnum" for comparison.
                    newlog[cursor[i].trackingnum] = {}; // new object.
                    newlog[cursor[i].trackingnum].companycode = cursor[i].companycode;
                    newlog[cursor[i].trackingnum].phonenum = cursor[i].phonenum;
                    newlog[cursor[i].trackingnum].history = JSON.parse(cursor[i].history);

                    if (cursor[i].companycode == CJ) {
                        CJ.CreateQueryPromise(cursor[i].trackingnum)
                        .then( ($) => { 
                            let res = CJ.TrackingDataToJSON($);
                            if (res.data.success) {
                                if (res.data.history.length != prevlog[res.data.trackingnum].history.length) {
                                    // something changed.
                                    let lastindex = res.data.history.length - 1;
                                    try{
                                        sendSMS(prevlog[res.data.trackingnum].phonenum, "택배 현황 업데이트 : " + res.data.history[lastindex].note);
                                        connection.query('UPDATE DeliveryLog SET wasnotified="Y" WHERE trackingnum='+res.data.trackingnum, function(err, cursor){
                                            co
                                        });
                                    }
                                    catch(e){
                                        console.log("SMS failed");
                                    }
                                    finally{
                                        delete(prevlog[res.data.trackingnum]);
                                    }
                                }
                            }
                        })
                        .catch( (err) => { 
                            res.json({ success:false, errmsg:err }) 
                        });
                    }
                    else if (cursor[i].companycode == KPOST) {

                    }
                }
            }
        });
    }
    catch(e){
        console.log("Error when checking for updates");
        console.log(e);
    }
}
setInterval(30000, checkUpdate);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/**
 * Get port from environment and store in Express.
 */

//var port = normalizePort(process.env.PORT || '3000');
var port = 9000;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
