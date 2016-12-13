var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var accessTokens = require('./accessTokens.js');
var User = require('../models/user');

module.exports = function (passport) {
  // Passport's session setup
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
      if (err) {
        console.log('Something happened in local-login');
        return done(err);
      }
      if (!user) {
        console.log('such a user does not exist');
        return done(null, false);
      }
      if (!user.validPassword(password)) {
        console.log('wrong password');
        return done(null, false);
      }
      return done(null, user);
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: accessTokens.googleClientId.web.client_id,
    clientSecret: accessTokens.googleClientId.web.client_secret,
    callbackURL: 'http://localhost:3000/auth/google/callback', //interesting
    passReqToCallback: true
  }, function (req, token, refreshToken, profile, done) { //tbh i'm not too sure about this request thing.
    process.nextTick( 
      function() {
        if (req.user) {
          if (req.user.google.id) {
            console.log('user exists, and is already authenticated by google.');
            return done(null, req.user);
          } else {
            var googleAuthObject = {
              'google': {
                'id': profile.id,
                'token': token,
                'name': profile.displayName,
                'email': profile.emails[0].value
              }
            }
            User.findOneAndUpdate({'email': req.user.email}, googleAuthObject, null, function(err, usr) {
              if (err) {
                console.log('error with updating the user');
                return done(null, false);
              }
              console.log('user was successfully updated with google tokens');
              return done(null, usr);
            });
          }
        } else {
          return done(null, false);
        }
      }
    );
  }));
};