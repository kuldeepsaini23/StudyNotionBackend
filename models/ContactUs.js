const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const contactUsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

contactUsSchema.post("save", async function (doc) {

  try{
    //transpoter
    let transpoter = nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
      },
    })

    //send mail
    let info = await transpoter.sendMail({
      from:'StudyNotion || kuldeepSaini',
      to:doc.email,
      subject:"Successfull",
      html:`<h1>We got your Response</h1>"`
    })

    let mailToMe = await transpoter.sendMail({
      from:'StudyNotion || kuldeepSaini',
      to:`techbro2311@gmail.com`,
      subject:"Successfull",
      html:`<h1>The Response was</h1>
          <p>${doc}</p>
      `
    })

  

  }catch(error){
    console.log(error);

  }
});

module.exports = mongoose.model("Contact", contactUsSchema);
