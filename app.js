var express= require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
var User = require('./models/user');


// app.use(express.static(__dirname + '/public')); // what does this do???


mongoose.connect('mongodb://localhost/final_project', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

app.use(bodyParser.urlencoded(false));

/* Routers */
var sessions = require('./routes/sessions');

app.get('/', function (req, res) {

  // User.find({}, function(err, docs) {
  //   if (!err){ 
  //       console.log(docs);
  //       process.exit();
  //   } else {throw err;}
  // });

  
  res.render('index');
});

app.use('/', sessions);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})