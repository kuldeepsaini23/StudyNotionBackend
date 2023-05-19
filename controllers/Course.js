const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Categories");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//course create
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    //get file
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
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

    //fetch category
    //*category we getting from req.body is id
    const categoryDetails = await Category.findById(category);
    //validate

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category details not found",
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
      category: categoryDetails._id,
      thumbnail: thumbnail.secure_url,
    });

    //user update  / add this course in user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update category hw
    await Category.findByIdAndUpdate(
      category,
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

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
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        instructor: true,
        price: true,
        thumbnail: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
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

exports.getCourse = async (req, res) => {
  try {
    //getting course id in req
    const { courseId } = req.body;

    //validate
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course details not found",
      });
    }

    //finding course
    const courseDetails = await Course.findById(courseId)
      .populate("instructor")
      .populate("courseContent")
      .populate("ratingAndReviews")
      .populate("category")
      .populate("studentsEnrolled");

      res.status(200).json({
        success: true,
        message: "Course with provided courseId return successfully",
        courseDetails,
      });

    //return response
  } catch (error) {
    console.log("Error while getting one Courses", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};