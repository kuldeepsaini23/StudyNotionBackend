const Social = require("../models/Social");
const User = require("../models/User");

// Function to create a new course
exports.createSocial = async (req, res) => {
  try {
    // Get user ID from request object
    // const userId = req.user.id;
    const { socialName, link, userId } = req.body;

    // Check if any of the required fields are missing
    if (!socialName || !link) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    //created a object of social
    const newSocialLink = Social.create({
      name: socialName,
      link,
    });

    // find user
    const user = User.findById(userId);
    if(!user){
      return res.status(400).json({
        success: false,
        message: "Cannot find the User",
      });
    }

    const userDetails = User.findByIdAndUpdate({_id: userId},
      {
        $push: {
          socials: newSocialLink._id,
        },
      },
      { new: true }
    )
    
    res.status(200).json({
      success: true,
      message: `${socialName} Link created Successfully`,
    });

  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error("error while creating social link", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Social Link",
      error: error.message,
    });
  }
};


exports.updateSocial = async (req, res) => {
	try {
		const { socialName, link } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);

		const social = await Social.findById(userDetails.socials);

		// Update the profile fields
		social.name = socialName || social.name;
		social.about = link || social.link;


		// Save the updated profile
		await social.save();
		const updatedUserDetails = await User.populate(userDetails, "socials");

		return res.json({
			success: true,
			message: "Socials updated successfully",
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

exports.deleteSocial = async (req, res) => {
	try {
		const id = req.user.id;
		
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Social.findByIdAndDelete({ _id: user.socials });
		res.status(200).json({
			success: true,
			message: "User Social deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Social Cannot be deleted successfully" });
	}
};