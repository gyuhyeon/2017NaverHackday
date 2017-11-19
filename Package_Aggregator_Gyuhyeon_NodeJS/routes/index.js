var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Barebone page' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: 'Barebone page' });
});

module.exports = router;
