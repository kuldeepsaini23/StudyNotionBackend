const Course = require("../models/Course");

exports.getAllCourses = async(req,res)=>{
  try{

    const coursesDetails = await Course.find({},
        {
          courseName:true,
          thumbnail:true,
        }
      ).sort({ createdAt: -1 }).populate("instructor").exec()

    if(!coursesDetails){
      return res.status(401).json({
        sucess:false,
        message:"Courses Not Found",
      })
    }

    return res.status(200).json({
      sucess:true,
      message:"Courses Sent Successfully",
      data:coursesDetails
    })

  }catch(error){
    console.log("Error While getting search courses", error)
    return res.status(404).json({
      sucess:false,
      message:"Internal Server Error"
    })
  }
}