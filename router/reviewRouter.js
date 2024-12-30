const express = require('express');
const router = express.Router({mergeParams:true});
const asyncwrap = require('../utils/ayncwrap.js');
const reviewController = require('../controllers/reviewController.js');
const {validateReview, isLoggedIn,isAuthor} = require('../middleware.js');

router.post('/',isLoggedIn,validateReview,asyncwrap(reviewController.create));

router.delete("/:reviewId",isLoggedIn,isAuthor,asyncwrap(reviewController.delete));

module.exports = router;