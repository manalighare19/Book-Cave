var User = require('../model/user');

module.exports.getAllUsers = function (db) {
  return new Promise((resolve, reject)=>{
    db.find({})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};

module.exports.getUser = function (user_Id,db) {
  return new Promise((resolve, reject)=>{
    db.findOne({userID:user_Id})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};

module.exports.addUser=function(userid,email,password,firstName,lastName,address1,address2,city,state,zipcode,country,db){

  var newUser = new User({userID:userid,email:email,Password:password, firstName:firstName,lastName:lastName,Address1:address1,Address2:address2,City:city,State:state,Zipcode:zipcode,Country:country});
      newUser.save(function(err,data){
      if(err)
        return console.error(err);
      });

}

module.exports.getCountofUsers = function(db){
    return db.count({});
};
