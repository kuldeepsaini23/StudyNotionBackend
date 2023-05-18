const Category = require("../models/Categories");

//create Category ka hanfler function

exports.createCategory = async (req, res) => {
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
    const categoriesDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoriesDetails);

    // Return Response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log("Error while Category Creating", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllCategories = async (req, res) => {
  try{

    const allCategories = await Category.find({}, {name:true, description:true});

    res.status(200).json({
      success:true,
      message:"All Categories return successfully",
      allCategories,
    })

  }catch(error){
    console.log("Error while getting all Categories", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}