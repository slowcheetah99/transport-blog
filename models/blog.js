const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 144,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  blogs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaccoDetails",
  },
});

module.exports = mongoose.model("Blogs", blogSchema, "Blogs");
