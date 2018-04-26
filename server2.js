//All dependencies required
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

//Express app initialized 
var express = require('express');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(process.cwd() + '/public'));
//Static public folder
// app.use(express.static("public"));



var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// //connecting to MongoDB
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds247699.mlab.com:47699/heroku_bbsmjm4s');

// mongoose.connect('mongodb://localhost/mecaniserdb');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is Connected!')
});

var routes = require('./controllers/controller.js');
app.use('/', routes);

var port = process.env.PORT || 3063;
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});