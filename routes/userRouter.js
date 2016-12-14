var express = require('express');
var router = express.Router();
var Event = require('../models/event');

router.get('/dashboard', function (req, res) {
  if (req.isAuthenticated()) {
    Event.find({}).populate('creator').exec(function(err, evts){
      if(err){
        console.log(err);
        res.render('dashboard.ejs', {user: req.user, events: null});
      } else{
        res.render('dashboard.ejs', {user: req.user, events: evts});
      }
    });
    
  } else {
    res.redirect('/'); //maybe flash something here?
  }
});

module.exports = router;