var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  memberId: Number,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: Boolean,
  officerPosition: String,
  google: {
    id: String,
    token: String,
    refreshToken: String,
    name: String,
    email: String
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;