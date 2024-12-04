const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js')
const userController = require('../controllers/user.js');

router.get('/signup',userController.signUp);

router.post('/signup',wrapAsync(userController.userSignup));

router.get('/login',userController.login);

router.post('/login',saveRedirectUrl,passport.authenticate('local',
  {failureRedirect:'/login',failureFlash:true}),
  userController.userLogin
);


router.get('/logout',userController.logOut);

module.exports = router;