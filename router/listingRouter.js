const express = require('express');
const router = express.Router();
const Listing = require('../models/listingModel.js');
const listingController = require('../controllers/listingController.js');
const asyncwrap = require('../utils/ayncwrap.js');
const {validateListing,isLoggedIn, isOwner} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js')
const upload = multer({storage});


//Index and Create 
router.route('/')
.get(asyncwrap(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),asyncwrap(listingController.create));

// New
router.get('/new',isLoggedIn,asyncwrap( listingController.new));

//Show , Delete and UPDATE
router.route('/:id')
.get(asyncwrap(listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),asyncwrap(listingController.update))
.delete(isLoggedIn,isOwner,asyncwrap(listingController.delete));

//Edit
router.get('/:id/edit',isLoggedIn,isOwner,asyncwrap(listingController.edit));

module.exports = router;