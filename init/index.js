const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listingModel.js');

const DB_URL = 'mongodb://127.0.0.1:27017/newWanderlust';


main()
.then(()=>{
  console.log('connected to DB');
})
.catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect(DB_URL);
}

async function initDB(){
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:'676c577a5e3a372d0cfdbf7e'}));
  await Listing.insertMany(initData.data);
  console.log('Data was initialized');
}
initDB();