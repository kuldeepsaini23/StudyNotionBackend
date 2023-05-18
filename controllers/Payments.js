const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates");
const { default: mongoose } = require("mongoose");

//payment capture and initiate Razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userId
  const { course_id } = req.body;
  const userId = req.body.id;

  //validation
  if (!userId) {
    return res.json({
      success: false,
      message: "Please Provide valid User Id",
    });
  }

  //valid courseId
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please Provide valid Course Id",
    });
  }

  //valid CourseDeatils
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    //User already paid for the same course or not
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Stuedent is already enrolled",
      });
    }
  } catch (error) {
    console.log("Error while validation buying course", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  //Order create
  const amount = course.prize;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    //initiate payemnt using razorpay

    const payementResponse = await instance.orders.create(options);
    console.log(payementResponse);

    //return response
    return res.status(200).json({
      success: true,
      message: "Payment is Created Successfully",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumnail: course.thumnail,
      orderId: payementResponse.id,
      currency: payementResponse.currency,
      amount: payementResponse.amount,
    });
  } catch (error) {
    console.log("Error while capturePayment Handler (Buying course)", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//!verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
  //server secret (Jo hmare pass hh)
  const webhooksecret = "12345678";

  const signature = req.headers("x-razorpay-signature");

  const shasum = crypto.createHmac("sha256", webhooksecret);
  shasum.upadate(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("payemnt is Authorized");

    //courseId and userId from notes of razorpay
    const { userId, courseId } = req.body.paylaod.payemnt.entity.notes;

    try {
      //*fullfile the action
      //find the course and enrolled student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: {
            studentEnrolled: userId,
          },
        },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not Found",
        });
      }

      console.log(enrolledCourse);

      //find the student added the course to their list enrolled course me
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );

      if (!enrolledStudent) {
        return res.status(500).json({
          success: false,
          message: "Student not Found",
        });
      }

      console.log(enrolledStudent);

      //Send Mail (Confirmation mail)
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations, you are onboarded into new StudyNotion Course",
        courseEnrollmentEmail
      );

      console.log(emailResponse);

      //retuen response

      return res.status(200).json({
        success: true,
        message: "Signature verfied and Course Added",
      });

    } catch (error) {
      console.log("Error while Verifying course and adding", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }else{
    //signature doesnot match

    //return response
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
