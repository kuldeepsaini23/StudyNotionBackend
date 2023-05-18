const mongoose = require("mongoose");

const courseSchema = new mongosse.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Section",
    }
  ],
  ratingAndReviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"RatingAndReview",
    }
  ],
  price:{
    type:Number
  },
  thumnil:{
    type:String,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
  },
  studentsEnrolled:[{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  }]
 
});

module.exports = mongoose.model("Course", courseSchema);
