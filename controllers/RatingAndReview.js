const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");

//create Rating
exports.createRating = async (req, res) => {
  try {
    //data fetch
    const { rating, review, courseId } = req.body;
    //userid fetch
    const userId = req.body.id;

    //validate(Check if user buyed or nerolled in the course)
    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "Course ID Not Found",
      });
    }

    const courseDetail = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetail) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    //check if user already reviwed course or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(404).json({
        success: false,
        message: "User Already reviwed the course",
      });
    }

    //create entry in db
    const ratingAndReviews = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    //updating that in Course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingAndReviews._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);

    //return response
    res.status(200).json({
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

//get Average rating
exports.getAveragerating = async (req, res) => {
  try {
    //get courseID
    const courseId = req.body.courseId;

    //calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averagerating: { $avg: "$rating" },
        },
      },
    ]);

    //return response
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating return successfully",
        averagerating: result[0].averagerating,
      });
    }

    //if there is no rating/reviews exist
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating given till now",
      averagerating: 0,
    });
  } catch (error) {
    console.log("Error while getting Average Rating and Review", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all rating and reviews
exports.getAllRating = async (req, res) => {
  try {
    const allRating = await RatingAndReview.find(
      {},
      {
        rating: true,
        review: true,
      }
    )
      .sort({ rating: "desc" })
      .populate(
        { path: "user",
        select:"firstName lastName email image"
       })
       .populate(
        { path: "course",
        select:"courseName"
       })

    res.status(200).json({
      success: true,
      message: "All Rating return successfully",
      data:allRating,
    });

  } catch (error) {
    console.log("Error while getting all Rating", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//*Maine likha tha
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
