const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const port = 8080;
const ejsMate = require('ejs-mate')
const methodOverride = require("method-override");
const wrapAsync = require('./utils/wrapAsync.js');
const expressError = require("./utils/expressError.js");
const {listingSchema} = require('./schema.js')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const validateListing = () => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new expressError(400,error);
  }
  else{
    next();
  }
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.get('/listings', wrapAsync(async(req,res)=>{
  const allListings = await Listing.find();
  res.render('index.ejs',{allListings});
}))

//new 
app.get('/listings/new',(req,res)=>{
  res.render('new.ejs');
})
app.post('/listings',validateListing,wrapAsync(async(req,res,next)=>{

    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');
}))

//show
app.get('/listings/:id',wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('show.ejs',{listing});
}))

//Edit
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('edit.ejs',{listing});
}))

app.patch('/listings/:id', validateListing,wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}))

//delete
app.delete('/listings/:id', wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}))

app.all('*',(req,res,next)=>{
  next(new expressError(404,'Page Not Found'));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message='Something Went Wrong!!'} = err;
  res.status(statusCode).render('error.ejs',{err})
  // res.status(statusCode).send(message);  
})

app.listen(port,()=>{
  console.log(`server is on port ${port}`);
})