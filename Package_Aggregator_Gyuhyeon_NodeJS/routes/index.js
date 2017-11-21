const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const CJ = require('../crawlerAPI/CJ');

const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});

router.get('/query', function(req, res, next){
    CJ.CreateQueryPromise(req.query.trackingnum)
        .then( ($) => {res.json(CJ.TrackingDataToJSON($))} );
});

module.exports = router;
