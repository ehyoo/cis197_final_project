var User = require('../models/user');
var accessTokens = require('../config/accessTokens.js');
var SCOPES = 

module.exports = function (app, passport) {

  var isNotLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    console.log("That's not a valid move");
    res.redirect('/');
  }

  app.get('/signup', isNotLoggedIn, function (req, res) {
    res.render('signup');
  });

  app.post('/signup', isNotLoggedIn, function (req, res) {
    var unhashedPassword = req.body.password;
    var user = new User();
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.isVerified = false;
    user.save(function (err, usr) {
      if (err) {
        throw err;
      } else {
        console.log('new user created');
        console.log(user);
        res.redirect('/'); // then maybe do the session thing?
      }
    });
  });

  app.get('/login', isNotLoggedIn, function (req, res) {
    res.render('login');
  });

  app.post('/login', isNotLoggedIn,
    passport.authenticate('local-login', {successRedirect: '/',
                                          failureRedirect: '/login',
                                          failureFlash: true
  }));

  app.get('/logout', function (req, res) {
    console.log('you have logged out');
    req.logout();
    res.redirect('/')
  });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/event',
    failureRedirect: '/dashboard'
  }));
}