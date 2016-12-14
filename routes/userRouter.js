var express = require('express');
var router = express.Router();
var Event = require('../models/event');

router.get('/dashboard', function (req, res) {
  if (req.isAuthenticated()) {
    Event.find({}).populate('creator').exec(function(err, evts){
      if(err){
        console.log(err);
        res.render('dashboard.ejs', {user: req.user, events: []});
      } else{
        var pendingEvent = [];
        var completedEvent = [];
        for (var i = 0; i < evts.length; i++) {
          if (evts[i].completed) {
            completedEvent.push(evts[i]);
          } else {
            pendingEvent.push(evts[i]);
          }
        }
        res.render('dashboard.ejs', {
          user: req.user, 
          cEvents: completedEvent,
          pEvents: pendingEvent
        });
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;