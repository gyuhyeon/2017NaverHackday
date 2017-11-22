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
    // TODO : make a db query first, before sending out the request
    // TODO : better error handling. It should always at least return json with "success:false" even when parent chain goes wrong
    
    //input verification
    if(req.query.trackingnum===undefined || req.query.trackingnum===null || req.query.trackingnum==""){
        res.json({success:false, errmsg:"송장번호 미입력"});
    }
    else if(req.query.companycode===undefined || req.query.companycode===null || req.query.companycode==""){
        res.json({success:false, errmsg:"택배사 미선택"});
    }
    else{ //normal user input
        if(req.query.companycode=="CJ"){
            CJ.CreateQueryPromise(req.query.trackingnum)
            .then( ($) => {res.json(CJ.TrackingDataToJSON($))} )
            .catch((err) => {res.json({success:false, errmsg:err})});
        }
        else if(req.query.companycode=="KPOST"){
            res.json({success:false, errmsg:"우체국 구현중"});
        }
        else if(req.query.companycode=="LOGEN"){
            res.json({success:false, errmsg:"로젠택배 구현중"});
        }
        else{
            res.json({success:false, errmsg:"해당 택배사는 구현계획이 없습니다."})
        }
    }
    
});

module.exports = router;
