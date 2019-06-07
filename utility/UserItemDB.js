
var userItemModel = require('../model/userItem');

module.exports.getUserItems=function(userID){
  return new Promise((resolve,reject)=>{
    userItemModel.find({userID:userID})
      .then(data => {
        resolve(data);
      }).catch(err=>{return reject(err); })
    });
  }


module.exports.addUserItem=function(itemCode,userID,catalogCategory,itemName){
  return new Promise((resolve,reject)=>{
    userItemModel.findOneAndUpdate({$and:[{userID:userID},{itemCode:itemCode}]},
      {$set:{UserID:userID,itemCode:itemCode, catalogCategory:catalogCategory,itemName:itemName,Rating:0,ReadIt:false}},
      {upsert:true},function(err,data){
        resolve(data);
      }).catch(err=>{return reject(err);});
});
}


module.exports.deleteUserItem=function(item_param){
  return new Promise((resolve,reject)=>{
    userItemModel.deleteOne({itemCode:item_param})
      .then(data => {
        resolve(data);
      }).catch(err=>{return reject(err); })
    });
  }


  module.exports.addItemRating=function(itemCode,userID,rating){
  return new Promise((resolve,reject)=>{
    userItemModel.findOneAndUpdate({$and:[{userID:userID},{itemCode:itemCode}]},
      {$set:{UserID:userID,itemCode:itemCode,Rating:rating}},
      {new:true,upsert:true},function(err,data){
        //console.log(data);
        resolve(data);
      }).catch(err=>{return reject(err);});

});
}


module.exports.addReadIt=function(itemCode,userID,read_it){
return new Promise((resolve,reject)=>{
  userItemModel.findOneAndUpdate({$and:[{userID:userID},{itemCode:itemCode}]},
    {$set:{UserID:userID,itemCode:itemCode,ReadIt:read_it}},
    {new:true,upsert:true},function(err,data){
      resolve(data);
    }).catch(err=>{return reject(err);});
});
}


  /*
   let flag=0;

   for(let i=0;i<userItemList.length;i++)
   {
       if(userItemList[i].itemCode==itemCode) {
          flag=1;
       }
   }

   if (flag==0){
       userItemList.push(userItemModel);
   }
module.exports.addItemRating = function(db){
  return new Promise((resolve, reject)=>{
    db.find({})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};

module.exports.addReadIt = function(item_code,db){
  return new Promise((resolve, reject)=>{
    db.findOne({itemCode:item_code})
      .then(data=>{
        resolve(data);
      }).catch(err=>{return reject(err);})
  })
};
*/
