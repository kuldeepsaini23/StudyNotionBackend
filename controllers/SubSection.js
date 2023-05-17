const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");
const { uploadImageToCloudinart } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //data fetch
    const { sectionId, title, timeDuration, description } = req.body;

    //get files
    const video = req.files.videoFile;

    //validate data
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinart(
      video,
      process.env.FOLDER_NAME
    );

    //create SubSection
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videUrl: uploadDetails.secure_url,
    });

    //push obvject id in Section model to update it in Section
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updateCourseDetails,
    });
  } catch (error) {
    console.log("Error while Creating SubSection", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //Data input
    const { subSectionId, title, timeDuration, description } = req.body; //Subsection id mne bbhji hh

    //data validation
    if (!title || !timeDuration || !description|| !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //update data
    //* const section = await Section.findByIdAndUpdate(sectionId, {sectionName:sectionName}, {new:true})
    const subSection = await Section.findByIdAndUpdate(
      subSectionId,
      { 
        title:title,
        timeDuration:timeDuration,
        description:description,

      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "SubSection Updated successfully",
    });
  } catch (error) {
    console.log("Error while Updating SubSection", error);
    return res.status(500).json({
      success: false,
      message: "Unable to Update SubSection, please try again",
      error: error.message,
    });
  }
};

exports.delteSection = async (req, res) => {
  try {
    //get id of Subsection
    //* Sending id in parameter
    const { subSectionId } = req.body;

    //delete
    const delteSection = await Section.findByIdAndDelete(subSectionId);

    //return response
    return res.status(200).json({
      success: true,
      message: "SubSection Deleted successfully",
    });
  } catch (error) {
    console.log("Error while Deleting SubSection", error);
    return res.status(500).json({
      success: false,
      message: "Unable to Delete subSectionId, please try again",
      error: error.message,
    });
  }
};
