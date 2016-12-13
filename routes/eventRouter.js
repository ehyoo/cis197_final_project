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
    var startDate = new Date(createDateString(req.body.startYear,
      req.body.startMonth,
      req.body.startDay,
      req.body.startHour,
      req.body.startMinute));
    var endDate = new Date(createDateString(req.body.endYear,
      req.body.endMonth,
      req.body.endDay,
      req.body.endHour,
      req.body.endMinute));
    var newEvent = new Event({
      creator: req.user,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      timeStart: startDate,
      timeEnd: endDate 
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