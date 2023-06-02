const Contact = require("../models/ContactUs");
const { mailSender } = require("../utlis/mailSender");

//creating contact handler
exports.contact = async (req, res) => {
  try {
    //getting data from req.body
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    //validate
    if (!phoneNumber || !lastName || !email || !phoneNumber || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }

    //saving data in db
    const contactDetails = await Contact.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      message: message,
    });

    if (!contactDetails) {
      return res.status(400).json({
        success: false,
        message: "contact details are not found",
      });
    }

    // const mailSendToUser = await mailSender(
    //   contactDetails.email,
    //   "Successfull",
    //   "Your Response is recieved by us we will try to response you as early as possible"
    // );

    // if(!mailSendToUser){
    //   return res.status(400).json({
    //     success: false,
    //     message: "Mail to user isnot send Successfully",
    //   });
    // }

    // const mailSendToMe = await mailSender(
    //   `aktdeku@gmail.com`,
    //   "You got a Response!!",
    //   `<h1>The Response</h1>
    //     <div>
    //     <p>${contactDetails}</p>
    //     </div>
    //   `
    // );

    //return respones
    res.status(200).json({
      success: true,
      message: "Conatct me Details create successfully",
      data: contactDetails,
    });
  } catch (error) {}
};
