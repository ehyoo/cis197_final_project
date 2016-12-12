var express = require('express');
var router = express.Router();


router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/register', function (req, res) {
  res.render('registration');
});

router.get('/logout', function (req, res) {
  console.log('you have logged out');
  res.redirect('/')
});

module.exports = router;