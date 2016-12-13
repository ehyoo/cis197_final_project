var express = require('express');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var router = express.Router();
var accessTokens = require('../config/accessTokens.js');
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

router.get('/googleAuth', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('dashboard.ejs', {user: req.user});
  } else {
    res.redirect('/'); //maybe flash something here?
  }
});


module.exports = router;