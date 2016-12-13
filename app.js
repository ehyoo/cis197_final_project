/* Express Setup */
var express      = require('express');
var app          = express();
var port         = process.env.port || 3000;
var mongoose     = require('mongoose');
/* Sessions Setup */
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var uuid         = require('node-uuid');

/* Models */
var User = require('./models/user');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url, function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected.');
  }
});

require('./config/passport')(passport); //comment this back in later

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded(false));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');


app.use(session({ secret: 'helloWorldMyNameIsEd'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash messages- will we need this??


// var generateSessionSecret = function () {
//   return 'iamasecret' + uuid.v4(); // not sure how this'll work.
// };
// // generateSessionSecret()


/* Routers */

app.get('/', function (req, res) {
  // User.find({}, function(err, docs) {
  //   if (!err){ 
  //       console.log(docs);
  //       process.exit();
  //   } else {throw err;}
  // });
  res.render('index');
});

require('./routes/sessions')(app, passport);


app.listen(port, function () {
  console.log('Example app listening on port ' + port);
})