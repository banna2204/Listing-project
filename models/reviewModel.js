const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  comment:String,
  rating:{
    type:Number,
    min:1,
    max:5
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

const Review = mongoose.model('Review',ratingSchema);
module.exports = Review;