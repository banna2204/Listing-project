const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

//REVIEW
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReviews));

// REVIEW delete
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete));

module.exports = router;