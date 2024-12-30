const Review = require('../models/reviewModel.js');
const Listing = require('../models/listingModel.js');

module.exports.create = async(req,res)=>{
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review); 
  review.author = req.user._id;
  listing.reviews.push(review);
  req.flash('success','Review created successfully!!')
  await review.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}

module.exports.delete = async(req,res)=>{
  let {id,reviewId} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Review Deleted!');

  res.redirect(`/listings/${id}`);
}