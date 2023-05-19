const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");

exports.createRating = async (req, res) => {
  try {
    //data fetch
    const { rating, review, courseId } = req.body;
    //userid fetch
    const userId = req.body.id;

    //validate
    if (!rating || !review || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //create entry in db
    const ratingAndReviews = await RatingAndReview.create({
      // user : userDetails._id
      user: userId,
      rating: rating,
      review: review,
    });

    //updating that in user
    const courseDetail = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingAndReviews._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      data: ratingAndReviews,
    });

  } catch (error) {
    console.log("Error while Creating Rating and Review", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.showAllRating = async (req, res) => {
 try{
  const allRating = await RatingAndReview.find(
    {},
    {
      rating: true,
      review: true,
    }
  )
    .populate("user")
    .exec();

  res.status(200).json({
    success: true,
    message: "All Rating return successfully",
    allCourses,
  });
 }catch(error){
  console.log("Error while getting all Rating", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
 }
}

exports.showCourseAllRating = async (req, res) => {
  try{
   const allCourseRating = await Course.find(
     {},
     {
       courseName: true,
     }
   )
     .populate("ratingAndReviews")
     .exec();
 
   res.status(200).json({
     success: true,
     message: "All Rating of a Course return successfully",
     allCourses,
   });
  }catch(error){
   console.log("Error while getting all Rating", error);
   return res.status(500).json({
     success: false,
     message: error.message,
   });
  }
 }