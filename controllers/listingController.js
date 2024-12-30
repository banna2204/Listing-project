const Listing = require('../models/listingModel');
const ExpressError = require('../utils/ExpressError.js');


module.exports.index = async(req,res)=>{
  const allListings = await Listing.find();
  res.render('listings/index.ejs',{allListings});
}

module.exports.new = async(req,res)=>{
  res.render('listings/new.ejs');
}

module.exports.create = async(req,res)=>{
let url = req.file.path;
let filename = req.file.filename;
const listing = new Listing(req.body.listing);
listing.owner = req.user._id;
listing.image = {url,filename};
await listing.save();
req.flash('success','New Listing Created!');
res.redirect('/listings');
}

module.exports.show = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id).populate({
    path:'reviews',populate:{path:'author'}})
    .populate("owner");
  if(!listing){
    req.flash('error','Listing you request does not exist!');
    res.redirect('/listings');
  }
  console.log(listing);
  res.render('listings/show.ejs',{listing});
}

module.exports.delete = async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success','Listing Deleted Successfully')
  res.redirect('/listings');
}

module.exports.edit = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash('error','Listing you request does not exist!');
    res.redirect('/listings');
  }
  res.render('listings/edit.ejs',{listing});
}


module.exports.update = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }

  req.flash('success','Listing Is Updated')
  res.redirect(`/listings/${id}`);
}