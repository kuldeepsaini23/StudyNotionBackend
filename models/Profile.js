const mongoose = require("mongoose");

const profileSchema = new mongosse.Schema({
  gender: {
    type: String,
  },
  dateofBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  profession:{
    type: String,
  }
});


module.exports = mongoose.model("Profile", profileSchema);