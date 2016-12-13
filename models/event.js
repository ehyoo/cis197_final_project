var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  creator: { type: Number, ref: 'User'},
  title: String,
  description: String,
  location: String,
  timeStart: Date,
  timeEnd: Date
});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;