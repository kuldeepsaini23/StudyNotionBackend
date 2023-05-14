const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tags");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//course create
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //get file
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details ", instructorDetails);
    //* Todo check if userid and instructor id are same

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    //fetch tag
    //*tag we getting from req.body is id
    const tagDetails = await Tag.findById(tag);
    //validate

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: "Tag details not found",
      });
    }

    //upload image
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry in db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnail.secure_url,
    });

    //user update  / add this course in user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails },
      {
        $push: {
          Course: newCourse._id,
        },
      },
      { new: true }
    );

    //update tag hw

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error while Course Creating", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all courses
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Tag.find(
      {},
      {
        courseName: true,
        instructor: true,
        price: true,
        thumbnail: true,
        ratingAndReviews:true,
        studentsEnrolled:true,
      }
    ).populate("instructor")
    .exec();

    res.status(200).json({
      success: true,
      message: "All Courses return successfully",
      allCourses,
    });
  } catch (error) {
    console.log("Error while getting all Courses", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
