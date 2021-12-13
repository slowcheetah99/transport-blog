const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      minlength: 6,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    //for two factor auth
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  { collection: "Admin" }
);
module.exports = mongoose.model("Admin", adminSchema, "Admin");
