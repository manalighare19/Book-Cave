var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userID: Number,
  Password: String,
  firstName: String,
  lastName: String,
  email: String,
  Address1: String,
  Address2: String,
  City: String,
  State: String,
  Zipcode: Number,
  Country: String
},{collection: 'Users'});

module.exports=mongoose.model('userModel',userSchema);
