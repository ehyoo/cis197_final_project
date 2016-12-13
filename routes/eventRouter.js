var express = require('express');
var Event = require('../models/event.js');

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

    console.log(parseInt(req.body.startYear));

    var endDate = new Date(parseInt(req.body.endYear),
      parseInt(req.body.endMonth),
      parseInt(req.body.endDay),
      parseInt(req.body.endHour),
      parseInt(req.body.endMinute));

    var newEvent = new Event({
      creator: req.user,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      timeStart: startDate,
      timeEnd: endDate 
    });

    var schedule = require('node-schedule');
    var asdf = newEvent.timeStart;
    console.log("Job scheduled.");
    schedule.scheduleJob(asdf, function() {
      console.log("ayy lmao");
    });

    newEvent.save(function (err, evnt) {
      if (err) {
        throw err;
      } else {
        console.log('new event created');
        console.log(evnt);
        res.redirect('/dashboard'); // then maybe do the session thing?
      }
    });





    // we'll put this here for now- we'll make this more robust later.
  } else {
    // throw error???
  }
});

var createDateString = function (year, month, day, hour, minute) {
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00";
}

module.exports = router;