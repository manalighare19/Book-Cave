var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userItemSchema = new Schema({
  userID: {type: Number,required:true},
  itemCode: {type: Number,required:true},
  itemName: String,
  catalogCategory: String,
  Rating:{type: Number,default:0},
  ReadIt:{type: Boolean,default:false}
},{collection: 'UserItems'});

module.exports=mongoose.model('userItemModel',userItemSchema);




/*
let useritem=function (itemCode,catalogCategory,itemName,Rating,ReadIt) {

    let useritemModel={
        itemCode:itemCode,
        catalogCategory:catalogCategory,
        itemName:itemName,
        Rating:Rating,
        ReadIt:ReadIt,
    };

    return useritemModel;
};

module.exports.useritem=useritem;
*/
