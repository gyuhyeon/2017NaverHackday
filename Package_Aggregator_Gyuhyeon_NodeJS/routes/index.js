var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: '배송조회 서비스' });
});

module.exports = router;
