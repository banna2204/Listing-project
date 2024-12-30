if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userModel.js');

const listingRouter = require('./router/listingRouter.js');
const reviewRouter = require('./router/reviewRouter.js');
const userRouter = require('./router/userRouter.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/public')));

// const DB_URL = 'mongodb://127.0.0.1:27017/newWanderlust';
const db_url = process.env.ATLASDB_URL;

async function main(){
  await mongoose.connect(db_url);
}

main().then(()=>{
  console.log('connected to DB');
})
.catch((err)=>{
  console.log(err);
})

app.get('/',(req,res)=>{
  res.send('hello');
})


const store = MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  Cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all('*',(req,res,next)=>{
  next(new ExpressError(404,'Page not found!'));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message='Something Went Wrong!!'} = err;
  res.status(statusCode).render('listings/error.ejs',{err})
  // res.status(statusCode).send(message);  
})

app.listen(8080,()=>{
  console.log('app listen on port 8080');
})