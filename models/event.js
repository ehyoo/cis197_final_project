var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  creator: { type: Number, ref: 'User'},
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timeStart: {
    type: Date,
    required: true
  },
  timeEnd: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
});

// eventSchema.pre('save', true, function(next, done) {
//   if (this.timeStart > this.timeEnd) {
//     next(new Error("Start time can't be after end time"));
//   } else {
//     console.log("it's valid. calling next...");
//     done();
//   }
// });

eventSchema.methods.markAsComplete = function() {
  this.completed = true;
  this.save(function (err) {
    if (err) {
      console.log('something went wrong with updating the object');
      return err;
    }
    console.log('Update complete!');
  });
}

eventSchema.statics.getCompleted = function(cb) {
  return this.find({completed: true}, cb);
}

eventSchema.statics.getPending = function(cb) {
  return this.find({completed: false}, cb);
}


var Event = mongoose.model('Event', eventSchema);
module.exports = Event;