const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

<<<<<<< HEAD
//auth
exports.auth = async (req, res, next) => {
    try{
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
 try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
=======
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
>>>>>>> 9570b88abee54c65c3669a520575522318207581
}


//isInstructor
<<<<<<< HEAD
exports.isInstructor = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }
=======
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
>>>>>>> 9570b88abee54c65c3669a520575522318207581
