const Tag = require("../models/Tags");

//create tag ka hanfler function

exports.createTag = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validate
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //create entry in db
    const tagsDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagsDetails);

    // Return Response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    console.log("Error while Tag Creating", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllTags = async (req, res) => {
  try{

    const allTags = await Tag.find({}, {name:true, description:true});

    res.status(200).json({
      success:true,
      message:"All tags return successfully",
      allTags,
    })

  }catch(error){
    console.log("Error while getting all Tags", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}