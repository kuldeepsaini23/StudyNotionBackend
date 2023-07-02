const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
    } = req.body;
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();

    const profile = await Profile.findById(userDetails.additionalDetails);

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();
    const updatedUserDetails = await User.populate(
      userDetails,
      "additionalDetails"
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // TODO: Find More on Job Schedule
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);
    console.log("Printing ID: ", req.user.id);
    const id = req.user.id;

    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    // TODO: Unenroll User From All the Enrolled Courses
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.log("ERRO IN UPDATING DISPLAY PICTURE...", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    //get userId
    const userId = req.user.id;

    //find user by id and populate Courses data
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    //Validate
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }

    // const courseId = userDetails.courses._id;
    // let courseProgressCount = await CourseProgress.findOne({
    // 	courseID: courseId,
    // 	userId: userId,
    // });

    // console.log("courseProgressCount : ", courseProgressCount);

    // if (!userDetails.courses				) {
    // 	return res.status(400).json({
    // 		success: false,
    // 		message: `Could not find course with id: ${courseId}`,
    // 	});
    // }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // let totalDurationInSeconds = 0;
    // userDetails.courses.courseContent.forEach((content) => {
    // 	content.subSection.forEach((subSection) => {
    // 		const timeDurationInSeconds = parseInt(subSection.timeDuration);
    // 		totalDurationInSeconds += timeDurationInSeconds;
    // 	});
    // });

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // return res.status(200).json({
    // 	success: true,
    // 	data: {
    // 		courseDetails,
    // 		totalDuration,
    // 		completedVideos: courseProgressCount?.completedVideos
    // 			? courseProgressCount?.completedVideos
    // 			: [],
    // 	},
    // });

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    //get instructor id
    const userId = req.user.id;

    //geting intructor all courses
    const courseDeatils = await Course.find({ instructor: userId });

    //getting info from course
    const courseData = courseDeatils.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;
      //create an new object with the additional details
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
				totalStudentsEnrolled: totalStudentsEnrolled,
				totalAmountGenerated: totalAmountGenerated
      };

			return courseDataWithStats
    });

				// return response
				return res.status(200).json({
					success: true,
					message: "Instructor Dashboard data send sucessfully",
					courses: courseData
				})

		


  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
