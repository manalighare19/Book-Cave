var Item = require('../model/item.js');

module.exports.getAllItems = function(db){
  return new Promise((resolve, reject)=>{
    db.find({})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};

module.exports.getItem = function(item_code,db){
  return new Promise((resolve, reject)=>{
    db.findOne({itemCode:item_code})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};

var category = ["Thriller & Suspense", "Romance"];

module.exports.getCountofItems = function(db){

    return new Promise((resolve,reject)=>{
        db.count()
            .then(data => {
                resolve(data);
            }).catch(err=>{return reject(err); })
    })


};
