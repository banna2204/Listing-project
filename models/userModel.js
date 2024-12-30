const mongoose = require('mongoose');
const passwordLocalMongoosh = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  }
})

userSchema.plugin(passwordLocalMongoosh);

module.exports = mongoose.model('User',userSchema);