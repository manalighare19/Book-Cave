var express = require('express');
var router = express.Router();
var itemDb = require('../utility/ItemDB');
var userItemDb = require('../utility/UserItemDB');
var useritem=require('../model/userItem');
var userprofile=require('../model/userprofile');
var item_Model=require('../model/item');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var session = require('express-session');

const { check, validationResult } = require('express-validator/check');


router.use(session({secret:'USER'}));

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/BookCave', {useNewUrlParser: true});
var db = mongoose.connection;


router.get('/home', function(req,res){
  if (req.session.theUser) {
      res.render('home', {theUser:req.session.theUser});
  }else {
      res.render('home', {theUser:null});
  }
});


router.get('/categories', async function(req,res){

  var categories = await getCategories();
  var itemData =await itemDb.getAllItems(item_Model);

console.log("categories is:"+JSON.stringify(categories));

  var data= {
      categories: categories,
      items: itemData
  }

  if (req.session.theUser) {
        res.render('categories',{data:data,theUser:req.session.theUser});
  }else {
        res.render('categories',{data:data,theUser:null});
  }

});

router.get('/categories/item/',[
  check('itemCode','Invalid Itemcode').not().isEmpty().isNumeric().isLength({min:1})] ,async function(req,res){

    if(!validationResult(req).isEmpty()){

    console.log("Error with the input : ",validationResult(req).mapped());
    var errors =validationResult(req).mapped();

    res.redirect('/categories');
    return;
  }else {
    var itemCode = req.query.itemCode;
    var item = await itemDb.getItem(itemCode,item_Model);
    var ItemCount=await itemDb.getCountofItems(item_Model);

    var data = {
      item: item
    }
    if (req.session.theUser) {
      if (itemCode<=0) {
        res.redirect('/categories');
      }
      else if (itemCode>ItemCount) {
        res.redirect('/categories');
      }else {
        res.render('item',{data:data,theUser:req.session.theUser});
      }
    }else {
      if (itemCode<=0) {
        res.redirect('/categories');
      }
      else if (itemCode>ItemCount) {
        res.redirect('/categories');
      }else {
        res.render('item',{data:data,theUser:req.session.theUser});
      }
    }
}
});


router.get('/myBooks', async function(req,res){
  if (req.session.theUser) {
    if (req.session.userProfile) {
    var useritems=await userItemDb.getUserItems(req.session.theUser.userID);
    res.render('myBooks',{UserItems:useritems, theUser:req.session.theUser});

}}else {
    res.render('login',{UserItems:null, theUser:null, errors:req.session.errors});
  }
});


router.get('/about', function(req,res){

  if (req.session.theUser) {
      res.render('about', {theUser:req.session.theUser});
  }else {
      res.render('about', {theUser:null});
  }
});


router.get('/contact', function(req,res){
  if (req.session.theUser) {
      res.render('contact', {theUser:req.session.theUser});
  }else {
      res.render('contact', {theUser:null});
  }
});


router.get('/feedback', function(req,res){
  res.redirect('home');
});

router.get('/register', function(req,res){
  res.render('register',{theUser:null, errors:null});
});

router.get('/additem', function(req,res){
  res.render('addItem',{theUser:req.session.theUser});
});



var categories = [];

let getCategories = async function() {
  var data = await itemDb.getAllItems(item_Model);

  for(var i=0; i<data.length;i++){
    if (!categories.includes(data[i].catalogCategory)) {
      categories.push(data[i].catalogCategory);
    }
  }
  return categories;
};

module.exports = router;
