const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());

const adminRouter = require("./routes/adminRoute");
const transRouter = require("./routes/router");

app.use("/admin", adminRouter);
app.use("/routes", transRouter);

app.use(compression());

app.get("/", (req, res) => {
  res.status(302).redirect("/routes/");
});

app.listen(process.env.PORT || 3000, () => {
  mongoose.connect(process.env.MONGO_URI_LOCALHOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection
    .once("open", () => {
      console.log("Connected to DB");
    })
    .on("error", () => {
      console.log("ERROR CONNECTING TO DB!");
    });
});
