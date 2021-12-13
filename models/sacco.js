const mongoose = require("mongoose");
const routeSchema = require("./routeSchema");

const saccoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  imageUpload: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetLink: {
    data: String,
    default: "",
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactDigits: {
    type: String,
    required: true,
  },
  routedRegistration: {
    type: Number,
  },
  routes: [routeSchema],
  blogs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blogs",
  },
});

module.exports = mongoose.model("SaccoDetails", saccoSchema, "SaccoDetails");
