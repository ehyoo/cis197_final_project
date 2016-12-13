var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('dashboard.ejs', {user: req.user});
  } else {
    res.redirect('/'); //maybe flash something here?
  }
});

module.exports = router;