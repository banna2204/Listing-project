let Listing = require('./models/listing');
let Review = require('./models/review');
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    req.session.requestUrl = req.originalUrl;
    req.flash('error','You must be logged in to Create Listing!');
    return res.redirect('/login');
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.requestUrl){
    res.locals.requestUrl = req.session.requestUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash('error','You are not the owner of this listing!')
    return res.redirect(`/listings/${id}`)
  }
  next();
}

module.exports.validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new expressError(400,error);
  }
  else{
    next();
  }
}

module.exports.validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    throw new expressError(400,error);
  }
  else{
    next();
  }
}


module.exports.isReviewAuthor = async(req,res,next) => {
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash('error','You are not the author of this review!')
    return res.redirect(`/listings/${id}`)
  }
  next();
}