const mongoose = require("mongoose");
const  mailSender = require("../utils/mailSender")

const OTPSchema = new mongosse.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required:true,
  },
  createdAt: {
    type: Date,
    default:Date.now(),
    expires:5*60,
  },

 
});

// a function --> to send email
async function sendVerificationEmail(email, otp){
  try{
    const mailResponse = await mailSender(email,"Verification from StudyNotion", otp);
    console.log("Email Sent Successfully ", mailResponse);

  }catch(error){
    console.log("Error occurred while sending Mail ", error);
    throw error; 
  }
}

//Pre middleware
OTPSchema.pre("save", async function(next){
  await sendVerificationEmail(this.email, this.otp);
  next();
})

module.exports = mongoose.model("OTP", OTPSchema);
