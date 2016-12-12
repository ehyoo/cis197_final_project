var express= require('express');
var app = express();
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// app.use(express.static(__dirname + '/public')); // what does this do???

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})