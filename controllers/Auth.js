const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");

//sendOtp
exports.sentOTP = async (req, res) => {
  try {
    //fetch email from request boody
    const { email } = req.body;

    //check if email exist or not
    const checkUserPresent = await User.findOne({ email });

    //if user already exist then return response
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Exist",
      });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(otp);

    //check unique otp or not
    var result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry in db
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log("Error while generating otp", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    //data fecth from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //data validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password match krlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent otp store in Database
    const recentOtp = await User.findOne({ email })
      .sort({ createAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      //*OTP not found
      return res.status(400).json({
        success: false,
        message: "Otp not Found/Valid",
      });
    } else if (otp !== recentOtp.otp) {
      //*Invalid Otp
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    //Passsword Hash
    const hashPassword = await bcrypt.hash(password, 10);

    //Create entry in Database

    //*Making a profile for additional details
    const prodileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      additionalDetails: prodileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    res.status(200).json({
      success: true,
      message: "User is registered Successfull/ Signup Successfull",
      user,
    });
  } catch (error) {
    console.log("Error while SignUp", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be Registered, Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //get data from rq body
    const { email, password } = req.body;

    //validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is Not registered, Please SignUp",
      });
    }

    //generate JWT, after password macthing
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      (user.token = token), (user.password = undefined);

      //create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Inccorrect",
      });
    }

    //create cookie and send response
  } catch (error) {
    console.log("Error while Login", error);
    return res.status(500).json({
      success: false,
      message: "Login failure, Please try again",
    }); 
  }
};

//change Password
exports.changePassword = async (req, res) => {
  try {
    //fetch user
    const { email, password } = req.body;
    const user = User.findOne({ email });

    //get oldPassword, newPassword, confirm password
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //validation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (await bcrypt.compare(oldPassword, user.password)) {
      //hashing new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      //update pwd in DB
      user.password = hashedPassword;
    }

    //send Mail - password
    await mailSender(
      email,
      "Your Password is changed",
      `Your Password is changed which is provided by you, So you can login with new password`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {}
};
