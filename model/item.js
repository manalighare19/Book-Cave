var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  itemCode: Number,
  itemName: String,
  catalogCategory: String,
  author: String,
  description: String,
  rating: Number,
  imgUrl: String
},{collection: 'Items'});

module.exports=mongoose.model('itemModel',itemSchema);






// class item {
//
//   constructor(itemCode, itemName, catalogCategory, author, description, rating, imageURL) {
//         this.itemCode = itemCode;
//         this.itemName = itemName;
//         this.catalogCategory = catalogCategory;
//         this.author = author;
//         this.description = description;
//         this.rating = rating;
//         this.imageURL = imageURL;
//     }
//
//     get itemCode() {
//         return this._itemCode;
//     }
//
//     set itemCode(value) {
//         this._itemCode = value;
//     }
//
//     get itemName() {
//         return this._itemName;
//     }
//
//     set itemName(value) {
//         this._itemName = value;
//     }
//
//     get catalogCategory() {
//         return this._catalogCategory;
//     }
//
//     set catalogCategory(value) {
//         this._catalogCategory = value;
//     }
//
//     get author() {
//         return this._author;
//     }
//
//     set author(value) {
//         this._author = value;
//     }
//
//     get description() {
//         return this._description;
//     }
//
//     set description(value) {
//         this._description = value;
//     }
//
//     get rating() {
//         return this._rating;
//     }
//
//     set rating(value) {
//         this._rating = value;
//     }
//
//     get imageURL() {
//         return this._imageURL;
//     }
//
//     set imageURL(value) {
//         this._imageURL = value;
//     }
//
//
// }
//
// module.exports = item;
