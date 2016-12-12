var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});


router.post('/signup', function (req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  })


  user.save(function (err, usr) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});



router.get('/logout', function (req, res) {
  console.log('you have logged out');
  res.redirect('/')
});

module.exports = router;