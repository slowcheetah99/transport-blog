const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  nickname: {
    type: String,
  },
  interval: {
    type: String,
  },
  currency: {
    type: String,
  },
  price: {
    type: Number,
  },
  state: {
    type: Number,
    ref: "SaccoDetails",
  },
});

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema,
  "Subscription"
);
