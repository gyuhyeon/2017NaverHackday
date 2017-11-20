var express = require('express');
var router = express.Router();
const crawler = require('../crawler');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});

router.get('/query', function(req, res, next){
    crawler.CJ.CreateQueryPromise(req.query.trackingnum)
        .then( ($) => {res.json(crawler.CJ.TrackingDataToJSON($))} );
});

module.exports = router;
