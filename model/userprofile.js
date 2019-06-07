let userItemList=[];
let userItemModel = require('../model/userItem');


let userProfile=function (userID) {

    let userProfileModel={
        userID:userID,
        userItems:userItemList
    };

    return userProfileModel;
};

module.exports.getUserItems=function(){
    return userItemList;
}
