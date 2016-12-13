var LocalStrategy = require('passport-local').Strategy;
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
};