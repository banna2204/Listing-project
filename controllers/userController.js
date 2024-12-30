const User = require('../models/userModel');

module.exports.signup = (req,res)=>{
  res.render('user/signup.ejs')
}

module.exports.userSignup = async(req,res,next)=>{
  try {
    const {username,email,password} = req.body;
    const user = new User({username,email});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash('success','Welcome to Wanderlust');
      res.redirect('/listings');
    })
  } catch (error) {
    req.flash('error',error.message);
    res.redirect('/signup');
  }
}

module.exports.login = (req,res)=>{
  res.render('user/login.ejs');
}

module.exports.userLogin = async(req,res)=>{
  req.flash('success','Welcome back to Wanderlust!');
  const requestUrl = res.locals.requestUrl || "/listings"
  res.redirect(requestUrl);
}

module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success','you logged out!');
    res.redirect('/listings');
  })
}