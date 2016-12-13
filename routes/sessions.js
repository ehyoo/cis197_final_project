var User = require('../models/user');
var accessTokens = require('../config/accessTokens.js');
var refresh = require('passport-oauth2-refresh');

module.exports = function (app, passport) {

  var isNotLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    console.log("That's not a valid move");
    res.redirect('/');
  }

  var refreshToken = function(req, res) {
    if (req.user) {
      if (req.user.google.refreshToken) {
        refresh.requestNewAccessToken('google', req.user.google.refreshToken, function(err, accessToken, refreshToken) {
          console.log('attempting to refresh the token');
          var googleAuthObject = {
            'google': {
              'token': accessToken,
              'refreshToken': refreshToken,
            }
          }
          User.findOneAndUpdate({'email': req.user.email}, googleAuthObject, null, function(err, usr) {
            if (err) {
              console.log('error with updating the user');
              return;
            }
            console.log('user was successfully updated with google tokens');
          });
        });
      } else {
        console.log('No refresh token available');
      }
    }
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

  app.post('/login', isNotLoggedIn, function (req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/login');
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          refreshToken(req, res);
          return res.redirect('/dashboard');
        });
      })(req, res, next);
  });

  app.get('/logout', function (req, res) {
    console.log('you have logged out');
    req.logout();
    res.redirect('/')
  });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline' 
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/event',
    failureRedirect: '/dashboard'
  }));
}