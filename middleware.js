let Listing = require('./models/listingModel');
let Review = require('./models/reviewModel.js');
const expressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    req.session.requestUrl = req.originalUrl;
    req.flash('error','You must be logged in to Create Listing!');
    return res.redirect('/login');
  }
  next();
}

module.exports.isOwner = async(req,res,next)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash('error','you are not owner of this listing');
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isAuthor = async(req,res,next)=>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash('error','you are not author of this review');
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.requestUrl){
    res.locals.requestUrl = req.session.requestUrl;
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
  }else{
    next();
  }
}