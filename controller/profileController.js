var express=require('express');
var item_Model=require('../model/item');
var itemDb = require('../utility/ItemDB');
var userDb = require('../utility/UserDB');
var userItemDb = require('../utility/UserItemDB');
var user_Model=require('../model/user');
var useritem=require('../model/userItem');
var userprofile=require('../model/userprofile');

var bodyParser=require('body-parser');
var session=require('express-session');

const { check, validationResult } = require('express-validator/check');

var userRouter=express.Router();
var urlencodedParser=bodyParser.urlencoded({extended:false});
userRouter.use(session({secret:'profile'}));


userRouter.get('/signin',urlencodedParser, async function(req,res) {

  if (req.session.errors) {
    //console.log('inside signin error:'+JSON.stringify(req.session.errors));
    res.render('login',{UserItems:null,theUser:null,errors:req.session.errors});
    req.session.errors=null;
  }else {

    if(req.session.theUser){
      res.render('myBooks',{UserItems:req.session.userProfile,theUser:req.session.theUser});
    }else{
      res.render('login',{UserItems:null,theUser:null,errors:null});
  }
  }

});


userRouter.post('/signin',urlencodedParser,[
  check('Username','Invalid Username').not().isEmpty().isEmail(),
  check('Password','Invalid password').not().isEmpty().isLength({min:8})],async function(req,res){

  if (!validationResult(req).isEmpty()) {
      var errors = req.validationErrors();
      if(errors){
        req.session.errors = errors;
      }
      console.log("Error with the input:",validationResult(req).mapped());
      res.redirect('/profile/signin');
      return;
  }else {
    var userObject=require('./../model/user');
    var userDB=require('./../utility/UserDB');
    var userprofile=require('./../model/userprofile');

    var username=req.body.Username;
    var password=req.body.Password;
    var flag=0;

    var users=await userDB.getAllUsers(user_Model);

    for (var i = 0; i < users.length; i++) {
      if (username===users[i].email) {
        if (password===users[i].Password) {
          console.log('email and password matched');
          flag=1;
          req.session.theUser=users[i];
          req.session.userProfile=await userItemDb.getUserItems(users[i].userID);

          res.render('myBooks',{UserItems:req.session.userProfile,theUser:req.session.theUser});
        }
      }
    }
  if (flag==0) {
    //console.log('inside iogin if');
    req.session.errors ={msg: "Either Username or Password is not correct"};
    res.redirect('/profile/signin');
  }
  }

});


userRouter.post('/signup',urlencodedParser,[
  check('Email','Invalid Email').not().isEmpty().isEmail().normalizeEmail(),
  check('Password','Password must be  atleast 8 characters.').not().isEmpty().isLength({min:8}),
  check('Confirm_Password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
  check('Firstname','First name is not valid.').not().isEmpty().isNumeric(),
  check('Lastname','Last name is not valid.').not().isEmpty().isNumeric(),
  check('Address_1','Please check your address.').optional(),
  check('Address_2').optional(),
  check('City','Please enter correct city.').not().isEmpty().isNumeric(),
  check('State','State is invalid.').not().isEmpty().isNumeric(),
  check('Country','Please enter valid country.').not().isEmpty().isNumeric(),
  check('Zipcode','Zipcode is not valid.').isNumeric()],async function(req,res){


  if (!validationResult(req).isEmpty()) {
      var errors = req.validationErrors();

      console.log("Error with the input:",validationResult(req).mapped());
      res.render('register',{theUser:null,errors:errors,UserItems:null});
      return;
  }else {
    var userObject=require('./../model/user');
    var userDB=require('./../utility/UserDB');
    var userprofile=require('./../model/userprofile');

    var users_count=await userDB.getCountofUsers(user_Model);

    userDb.addUser(users_count+1,req.body.Email,req.body.Password,req.body.Firstname,req.body.Lastname,req.body.Address_1,req.body.Address_2,req.body.City,req.body.State,req.body.Zipcode,req.body.Country,user_Model);
    res.redirect('/profile/signin');
  }

});



userRouter.post('/myBooks',urlencodedParser, [
      check('itemCode').not().isEmpty().isNumeric({min:1,max:6}),
      check('itemName').not().isEmpty().isString().optional(),
      check('Category').isString().optional(),
    ],async function (req,res) {

      if(!validationResult(req).isEmpty()){

        console.log("Error with the input : ",validationResult(req).mapped());
        var errors =validationResult(req).mapped();

        res.redirect('/myBooks');
        return;
    }else {

      if(req.session.userProfile){
          if (req.body.action=="Save"){
            await userItemDb.addUserItem(req.body.itemCode,req.session.theUser.userID,req.body.Category,req.body.itemName);
            var userItems=await userItemDb.getUserItems(req.session.theUser.userID);
            res.render('myBooks',{UserItems:userItems,theUser:req.session.theUser});
          }

          else if (req.body.action=="deleteItem") {
            var userdb=require('../model/userprofile');
            await userItemDb.deleteUserItem(req.body.itemCode);
            var useritems=await userItemDb.getUserItems(req.session.theUser.userID);
            res.render('myBooks',{UserItems:useritems,theUser:req.session.theUser});
          }

          else if (req.body.action=="updateProfile") {
            var itemdb = require('../utility/ItemDB');
            var useritems = await userItemDb.getUserItems(req.session.theUser.userID);
            var item = await itemdb.getItem(req.body.itemCode,item_Model);

            let flag=0;
            for(let i=0; i<useritems.length; i++){
              if (req.body.itemCode==useritems[i].itemCode) {
                flag=1;
                item.Rating=useritems[i].Rating;
                item.ReadIt=useritems[i].ReadIt;
                 res.render('feedback', {theItem:item,theUser:req.session.theUser});
               }
             }
             if (flag==0) {
               res.render('myBooks', {UserItems:useritems,theUser:req.session.theUser});
             }
           }

           else if(req.body.action=="updateRating"){
             var ratingVal=req.body.star;
             if(typeof ratingVal!=="undefined"){
               userItemDb.addItemRating(req.body.itemCode,req.session.theUser.userID,ratingVal);
             }else {
               userItemDb.addItemRating(req.body.itemCode,req.session.theUser.userID,0);
             }
             var useritems=await userItemDb.getUserItems(req.session.theUser.userID);
             res.render('myBooks',{UserItems:useritems,theUser:req.session.theUser});
           }

           else if(req.body.action=="updateFlag"){
             if(req.body.ReadIt=="Yes"){
               userItemDb.addReadIt(req.body.itemCode,req.session.theUser.userID,true);
               var useritems=await userItemDb.getUserItems(req.session.theUser.userID);
               res.render('myBooks',{UserItems:useritems,theUser:req.session.theUser});
             }else{
               userItemDb.addReadIt(req.body.itemCode,req.session.theUser.userID,false);
               var useritems=await userItemDb.getUserItems(req.session.theUser.userID);
               res.render('myBooks',{UserItems:useritems,theUser:req.session.theUser});
             }
           }

           else if (req.body.action == "rateIt") {
             var itemdb = require('../utility/ItemDB');
             var useritems = await userItemDb.getUserItems(req.session.theUser.userID);
             var item = await itemdb.getItem(req.body.itemCode,item_Model);

             let flag=0;
             for(let i=0; i<useritems.length; i++){
               if (req.body.itemCode==useritems[i].itemCode) {
                 flag=1;
                 res.render('feedback', {theItem:item,theUser:req.session.theUser});
               }
             }
             if (flag==0) {
               res.render('myBooks', {UserItems:useritems,theUser:req.session.theUser});
             }
         }
       }else{
         console.log('in else');
           res.redirect('/profile/signin');
         }

    }



 });

 userRouter.post('/signOut', urlencodedParser, function (req,res){
   if (req.session.theUser) {
     req.session.destroy();
     res.render('home', {theUser:null});
   }
 });

module.exports=userRouter;
