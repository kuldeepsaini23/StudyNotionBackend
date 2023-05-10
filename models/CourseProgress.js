const mongoose = require("mongoose");

const courseProgressSchema = new mongosse.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  conpletedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
 
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
