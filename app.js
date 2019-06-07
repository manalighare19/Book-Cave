var express = require('express');
var app = express();
var routes = require('./controller/catlogController.js');
var userRouter=require('./controller/profileController.js');

var expressValidator = require('express-validator');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/BookCave', {useNewUrlParser: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});

app.use(expressValidator());
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use('/',routes);
app.use('/profile',userRouter);

app.get('/*', function(req,res){
  if (req.session.theUser) {
      res.render('home', {theUser:req.session.theUser});
  }else {
      res.render('home', {theUser:null});
  }
});
app.listen(8080, function(req,res){
  console.log('Listening on port 8080..');
});
