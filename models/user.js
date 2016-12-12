var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  memberId: Number,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  isVerified: Boolean,
  officerPosition: String,
});

var User = mongoose.model('User', userSchema);

module.exports = User;