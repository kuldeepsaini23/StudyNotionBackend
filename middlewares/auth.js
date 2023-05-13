const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//Auth
exports.auth = async(res,req,next)=>{
  try{
    //extract token
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    
    //token is missing
    if(!token){
      return res.status(401).json({
        success: false,
        message: "Token is Missing",
      });
    }

    //token verify 
    try{
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decode);
      req.user = decode;

    }catch(err){
      //verfication issue
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    next()
  }catch(error){
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong whike validatig the token",
    });
  }

}

//isStudent
exports.isStudent = async (req,res,next)=>{
  try{
    if(req.user.accountType !== "Student"){
      return res.status(500).json({
        success: false,
        message: "This is a Protected Route for Student only",
      });
    }

    next();
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be Verified",
    });
  }
}


//isInstructor
exports.isInstructor = async (req,res,next)=>{
  try{
    if(req.user.accountType !== "Instructor"){
      return res.status(500).json({
        success: false,
        message: "This is a Protected Route for Instructor only",
      });
    }

    next();
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be Verified",
    });
  }
}

//isAdmin
exports.isAdmin = async (req,res,next)=>{
  try{
    if(req.user.accountType !== "Admin"){
      return res.status(500).json({
        success: false,
        message: "This is a Protected Route for Admin only",
      });
    }

    next();
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be Verified",
    });
  }
}