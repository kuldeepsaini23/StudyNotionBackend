const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res)=>{
  try{

    //data fetch
    const{sectionName, courseId} = req.body;

    //validate data
    if(!sectionName || !courseId){
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }
    //create section
    const newSection = await Section.create({sectionName});

    //push obvject id in course model to update it in course
    const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
      {
        $push:{
          courseContent:newSection._id,
        }
      },
      {new:true}, 
      )

    //return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updateCourseDetails,
    });
  }catch(error){
    console.log("Error while Creating Section", error);
    return res.status(500).json({
      success: false,
      message: "Unable to Create new section, please try again",
      error:error.message,
    });
  }
}

exports.updateSection = async(req,res)=>{
  try{
    //Data input
    const {sectionName, sectionId} = req.body; //section id mne bbhji hh

    //data validation 
    if(!sectionName || !sectionId){
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //update data
    //* const section = await Section.findByIdAndUpdate(sectionId, {sectionName:sectionName}, {new:true})
    const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})

    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  }catch(error){
    console.log("Error while Updating Section", error);
    return res.status(500).json({
      success: false,
      message: "Unable to Update Section, please try again",
      error:error.message,
    });
  }
}


exports.delteSection = async(req,res)=>{
  try{
      //get id of section
      //* Sending id in parameter
      const {sectionId} = req.body;

      //delete
      const delteSection = await Section.findByIdAndDelete(sectionId)

      //TODo we need to delte the entry from course Schema? (we will see in testing)

      //return response
      return res.status(200).json({
        success: true,
        message: "Section Deleted successfully",
      });

  }catch(error){
    console.log("Error while Deleting Section", error);
    return res.status(500).json({
      success: false,
      message: "Unable to Delete Section, please try again",
      error:error.message,
    });
  }
}
