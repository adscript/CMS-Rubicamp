var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/data', function(req, res) {
  res.render('data');
});

module.exports = router;
