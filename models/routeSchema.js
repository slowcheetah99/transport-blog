const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: Number,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  normalFare: {
    type: Number,
    required: true,
  },
  rushHourFare: {
    type: Number,
    required: true,
  },
});

module.exports = routeSchema;
