var express = require('express');
var Event = require('../models/event.js');
var schedule = require('node-schedule');
var botHelper = require('../config/botHelper.js');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var accessTokens = require('../config/accessTokens.js');
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

    startDate = new Date(Date.now() + 4000);
    endDate = new Date(Date.now() + 1000000);

    var newEvent = new Event({
      creator: req.user,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      timeStart: startDate, // TODO: be sure to change this to the actual time.
      timeEnd: endDate //endDate 
    });

    newEvent.save(function (err, evnt) {
      if (err) {
        console.log('The event was not valid- please try again');
        res.redirect('/event');
      } else {
        console.log('new event created=======');
        console.log(evnt);
        console.log('=======');
        postEventOnCalendar(createGoogleEvent(newEvent), req);
        scheduleEvent(newEvent); // TODO: handle lazily to allow deletion?
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

var createGoogleEvent = function(event) {
  console.log(event.timeStart.toISOString());
  console.log(event.timeEnd.toISOString());
  var googleEvent = {
    'summary': event.title,
    'location': event.location,
    'description': event.description,
    'start': {
      'dateTime': event.timeStart.toISOString()
    },
    'end': {
      'dateTime': event.timeEnd.toISOString()
    }
  }
  return googleEvent;
}

var postEventOnCalendar = function (event, req) {
  if (!req.user.google.token) {
    console.log('no token');
    return;
  }
  var oauth2Client = new OAuth2(
    accessTokens.googleClientId.web.client_id,
    accessTokens.googleClientId.web.client_secret,
    accessTokens.googleClientId.web.redirect_uris[0]);
  oauth2Client.setCredentials(
    {'access_token': req.user.google.token,
    'refresh_token': req.user.google.refreshToken});
  
  var calendar = google.calendar('v3');
  calendar.events.insert({
    auth: oauth2Client, // user's token
    calendarId: 'primary', //accessTokens.lxaCalendarId,
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
}

module.exports = router;