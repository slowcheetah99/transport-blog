//schema for subscribing for the newsletter
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commuterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  selectSub: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "subscribed",
  },
});

module.exports = mongoose.model("Commuters", commuterSchema);
