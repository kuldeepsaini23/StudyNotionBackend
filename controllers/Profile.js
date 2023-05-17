const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get userId
    const id = req.user.id;

    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //find profile
    const userDetails = await User.findById(id);

    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.log("Error while updating Profile", error);
    return res.status(500).json({
      success: false,
      message: "User Profile cannot be updated",
      error: error.message,
    });
  }
};

//delete account
//TODO: How can we schedule a task
exports.deleteProfile = async (req, res) => {
  try {
    //get User id
    const id = req.body.id;

    //validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not Found",
      });
    }

    //profile delte of user
    //* method one
    // const profileId = userDetails.additionalDetails;

    // await Profile.findByIdAndDelete(profileId);

    //*Method 2
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //TODO: unroll user from all the rolled course

    //delete user
    await User.findByIdAndDelete({ _id: id });

    //return response
    return res.status(200).json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    console.log("Error while deleting Profile", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be delete Successfully",
      error: error.message,
    });
  }
};

//get all data
exports.getUserDetails = async (req, res) => {
  try {
    //get userId
    const id = req.user.id;

    //validate
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //find user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "User Data fecthed Successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log("Error while getting User data", error);
    return res.status(500).json({
      success: false,
      message: "",
      error: error.message,
    });
  }
};
