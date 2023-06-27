const mongoose = require("mongoose");

// Define the Tags schema
const socialSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
  link:{
    type: String,
    required: true
  }
});

// Register the 'Social' model with Mongoose
const Social = mongoose.model('Social', socialSchema);

// Export the 'Social' model
module.exports = Social;