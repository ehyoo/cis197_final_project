var express = require('express');
var Event = require('../models/event.js');
var schedule = require('node-schedule');
var botHelper = require('../config/botHelper.js');
var router = express.Router();

router.get('/event', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('newEvent.ejs', {user: req.user});
  } else {
    res.redirect('/'); //maybe flash something here?
  }
});

router.post('/createEvent', function (req, res) {
  if (req.isAuthenticated()) {
    var startDate = new Date(parseInt(req.body.startYear),
      parseInt(req.body.startMonth) - 1,
      parseInt(req.body.startDay),
      parseInt(req.body.startHour),
      parseInt(req.body.startMinute));

    var endDate = new Date(parseInt(req.body.endYear),
      parseInt(req.body.endMonth) - 1,
      parseInt(req.body.endDay),
      parseInt(req.body.endHour),
      parseInt(req.body.endMinute));

    let pseudoStart = new Date(Date.now() + 4000);

    var newEvent = new Event({
      creator: req.user,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      timeStart: pseudoStart, // TODO: be sure to change this to the actual time.
      timeEnd: endDate 
    });
    scheduleEvent(newEvent); // TODO: handle lazily to allow deletion?
    newEvent.save(function (err, evnt) {
      if (err) {
        throw err;
      } else {
        console.log('new event created');
        console.log(evnt);
        res.redirect('/dashboard');
      }
    });
  } else {
    res.redirect('/');
  }
});

var scheduleEvent = function (event) {
  schedule.scheduleJob(event.timeStart, function() {
    console.log('calling message...');
    botHelper(event);
  });
};

module.exports = router;