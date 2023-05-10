const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database is connected Successfully"))
    .catch((error) => {
      console.log("Database is not connected");
      console.log(error);
      process.exit(1);
    });
};
