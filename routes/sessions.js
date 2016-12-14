var User = require('../models/user');
var accessTokens = require('../config/accessTokens.js');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  accessTokens.googleClientId.web.client_id,
  accessTokens.googleClientId.web.client_secret,
  accessTokens.googleClientId.web.redirect_uris[0]);

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
        console.log('User could not be saved- are you filling out the correct information?');
        res.redirect('/signup');
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
          // do the refresh here.
          oauth2Client.setCredentials(
            {'access_token': user.google.token,
            'refresh_token': user.google.refreshToken});
          console.log(user);
          console.log(oauth2Client);
          oauth2Client.refreshAccessToken(function(err, tokens) {
            if (err) {
              return err;
            }
            User.findOneAndUpdate({email: user.email}, {'google.token': tokens.access_token}, 
              function (err, ur) {
                if (err) {
                  return err;
                }
              });
          });

          return res.redirect('/dashboard');
        });
      })(req, res, next);
  });

  app.get('/logout', function (req, res) {
    console.log('you have logged out');
    req.logout();
    res.redirect('/')
  });

  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 
      'email', 
      'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline', approvalPrompt: 'force'}
    )
  );

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/event',
    failureRedirect: '/dashboard'
  }));
}