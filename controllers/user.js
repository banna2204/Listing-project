const User = require('../models/user.js');

module.exports.signUp = (req,res)=>{
  res.render('users/signup.ejs')
}

module.exports.userSignup = async(req,res)=>{
  try {
    let {username,email,password} = req.body;
    const newUser = new User({username,email}); 
    const userRegistered = await User.register(newUser,password);
    req.login(userRegistered,(err)=>{
      if(err){
        return next(err);
      }
      req.flash('success','Welcome to Wanderlust');
      res.redirect('/listings');
    })
  } catch (error) {
    req.flash('error',error.message);
    res.redirect('/listings');
  }
}

module.exports.login = (req,res)=>{
  res.render('users/login.ejs')
}

module.exports.userLogin = async(req,res)=>{
  req.flash('success',"Welcome back to Wanderlust");
  let RedirectUrl = res.locals.requestUrl || '/listings' ;
  res.redirect(RedirectUrl);
}

module.exports.logOut = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success','You are logged out!');
    res.redirect('/listings');
  })
}