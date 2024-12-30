const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const asyncwrap = require('../utils/ayncwrap');


router.route('/signup')
.get(userController.signup)
.post(asyncwrap(userController.userSignup));

router.route('/login')
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.userLogin);

router.get('/logout',userController.logout);

module.exports = router;