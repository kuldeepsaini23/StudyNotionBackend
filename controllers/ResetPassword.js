<<<<<<< HEAD

const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
=======
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

///reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;
>>>>>>> 9570b88abee54c65c3669a520575522318207581

    //check user for this email, email verification
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered with Us",
      });
    }

<<<<<<< HEAD
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body
        const email = req.body.email;
        //check user for this email , email validation
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({success:false,
            message:'Your Email is not registered with us'});
        }
        //generate token 
        const token  = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                        },
                                        {new:true});
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email, 
                        "Password Reset Link",
                        `Password Reset Link: ${url}`);
        //return response
        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }



   
}


//resetPassword\

exports.resetPassword = async (req, res) => {
    try {
          //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token: token});
        //if no entry - invalid token
        if(!userDetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }
        //token time check 
        if( userDetails.resetPasswordExpires < Date.now()  ) {
                return res.json({
                    success:false,
                    message:'Token is expired, please regenerate your token',
                });
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:'Password reset successful',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}
=======
    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true } //Due to this we get updated document
    );

    //generate link
    const url = `https://localhost:3000/update-password/${token}`;

    //send mail containg the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    //return Response
    return res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully, Please Check email and Change Password",
    });
  } catch (error) {
    console.log(
      "error while generating Password Token or Sending mail ",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Something went Wrong While Sending Reset Password Link",
    });
  }
};

//reset password(update password on DB)
exports.resetPassword = async (req, res) => {
  try {
    //data fecth
    const {password, confirmPassword, token} = req.body;

    //validation
    if(password !== confirmPassword){
      return res.json({
        success: false,
        message: "Password not Matching, Please fill same Password in confirm password and Password",
      });
    }

    //get user details from db using token
    const userDetails = await User.findOne({token:token});
    //if no entry- invalid token
    if(!userDetails){
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    //token time check
    if(userDetails.resetPasswordExpires < Date.now()){
      return res.json({
        success: false,
        message: "Token is expired, please regenerate your token",
      });
    }

    //hash pwd
    const hashedPassword = await bcrypt.hash(password,10);

    //update password in db
    await User.findByIdAndUpdate(
      {token:token},
      {password:hashedPassword},
      {new :true},
    )

    //return response
      return res.status(200).json({
        success: true,
        message: "Password reset Successfully",
      });
 
  } catch (error) {
    console.log(
      "Error while Password Reset or Hashing",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Something went Wrong While Password Reset and Updating in DB",
    });
  }
};
>>>>>>> 9570b88abee54c65c3669a520575522318207581
