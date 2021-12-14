const bcrypt = require("bcrypt");
const saccoValidation = require("./../models/validation/saccoValidation");
const jwt = require("jsonwebtoken");
const saccoUser = require("./../models/sacco");
const Blog = require("./../models/blog");
const jwtAuth = require("../jwt_auth/jwtCtrl");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const passTokenHandler = require("../middleware/emailHandler");
const crypto = require("crypto");

const maxAge = 1 * 24 * 60 * 60;
const maxAge__mail = 5 * 60;
//middleware for creating the token
const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: maxAge,
  });
};

//middleware for image upload

exports.getSaccoCtrl = async (req, res, next) => {
  const mapboxToken = process.env.MAPBOX_TOKEN;
  //for circular errors, make the callback asynchronous
  const users = await saccoUser.find({});
  try {
    Blog.find({}, (err, data) => {
      if (err) {
        console.log(err);
        res.redirect("/routes/");
      } else {
        res.status(200).render("index", {
          users: users,
          blogs: data,
          mapToken: mapboxToken,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
exports.postSaccoRegisterCtrl = async (req, res, next) => {
  //make sure to make the bcrypt functions asynchronous
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // const fileName = await req.file.filename.replace("C:\\fakepath\\", "");
  let routesInfo = [];
  if (Array.isArray(req.body.routeNumber)) {
    routesInfo.push({
      routeNumber: req.body.routeNumber[0],
      start: req.body.start[0],
      end: req.body.end[0],
      normalFare: req.body.normalFare[0],
      rushHourFare: req.body.rushHourFare[0],
    });
    routesInfo.push({
      routeNumber: req.body.routeNumber[1],
      start: req.body.start[1],
      end: req.body.end[1],
      normalFare: req.body.normalFare[1],
      rushHourFare: req.body.rushHourFare[1],
    });
  } else {
    routesInfo.push({
      routeNumber: req.body.routeNumber,
      start: req.body.start,
      end: req.body.end,
      normalFare: req.body.normalFare,
      rushHourFare: req.body.rushHourFare,
    });
  }
  const imageFile = req.file.filename;

  const user = new saccoUser({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    imageUpload: imageFile,
    email: req.body.email,
    password: hashPassword,
    contactPerson: req.body.contactPerson,
    contactDigits: req.body.contactDigits,
    routes: [...routesInfo],
  });

  console.log(user);
  const { error } = await saccoValidation.registerValidation(req.body);
  //checking for conditions met
  if (error) {
    return res.status(400).json({
      status: res.statusCode,
      message: error.message,
      values: user,
    });
  }
  const currUser = await saccoUser.findOne({ email: req.body.email });
  if (currUser) {
    return res.status(400).json({ error: "Existing Email. Try Again" });
  }

  try {
    //creating the token
    const authEmail = req.body.email;
    let verifiedEmail = jwt.sign(
      { authEmail },
      process.env.PASS_CONFIRM_TOKEN,
      {
        expiresIn: 5 * 60,
      }
    );
    //storing the token in a cookie
    res.cookie("emailJwt", verifiedEmail, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    passTokenHandler.sendEmail({
      email: req.body.email,
      subject: "Email Confirmation",
      message: `<h2>Click this <a href=${req.protocol}://${req.hostname}:${process.env.PORT}/routes/email-confirm>link</a> to confirm your email. It will be inactive in the next 5 minutes</h2>`,
    });
    const savedUser = await user.save();
    console.log(savedUser);
    //creating the token
    let verifiedAdmin = jwtToken(savedUser._id);
    //storing the token in a cookie
    res.cookie("cookieJwt", verifiedAdmin, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: savedUser._id, message: "Success!" });

    //res.status(301).redirect(`/routes/${savedUser._id}`);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.emailCheck = (req, res, next) => {
  res.status(200).render("email-check");
};

exports.emailConfirm = (req, res, next) => {
  res.status(200).render("email__confirm");
};

exports.getSpecificSaccoCtrl = async (req, res, next) => {
  let id = req.params.id;
  const currUser = await saccoUser.findById({ _id: id });
  if (currUser) {
    res.status(200).render("home", {
      userSpecific: currUser,
      saccoRoutes: currUser.routes,
    });
  } else {
    console.error(err);
    res.status(302).redirect("/");
  }
};

//loginValidation
exports.postSaccoLoginCtrl = async (req, res, next) => {
  const { error } = saccoValidation.loginValidation(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await saccoUser.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Wrong Email or Password." });
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({ error: "Wrong Email or Password!" });
  }
  try {
    //creating the token
    let verifiedAdmin = jwtToken(user._id);
    //storing the token in a cookie
    res.cookie("cookieJwt", verifiedAdmin, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    return res.status(200).json({
      user: user._id,
      status: res.statusCode,
      message: "Successful Login",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: error.message });
  }
};
/*send({auth: true, token: token}).render('home');*/

//update
exports.updateSaccoCtrl = async (req, res, next) => {
  const currSacco = await saccoUser.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  if (currSacco) {
    res.status(200).send(currSacco);
  } else {
    console.error(err);
  }
};

//delete
exports.deleteSaccoCtrl = async (req, res, next) => {
  const deletedSacco = await saccoUser
    .finByIdAndDelete({ _id: req.params.id })
    .findOne({ _id: req.params.id });

  if (!deletedSacco) {
    return res.status(400).send("No such blog exists!");
  }
  res.status(200).send(deletedSacco);
};

exports.getSaccoLogoutCtrl = (req, res, next) => {
  //storing the token in a cookie
  res.cookie("cookieJwt", "", {
    maxAge: 1,
  });
  res.status(302).redirect("/routes/");
};

exports.passWordResetGet = (req, res, next) => {
  res.render("password-reset");
};

exports.passWordResetPost = async (req, res, next) => {
  const userMail = await saccoUser.findOne({ email: req.body.email });
  console.log(userMail.name);
  if (userMail) {
    var userPass = await crypto.randomBytes(13).toString("hex");

    //use bcrypt to encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userPass, salt);

    await saccoUser.findByIdAndUpdate(
      { _id: userMail._id },
      { password: hashPassword },
      { new: true }
    );

    //send password reset email
    passTokenHandler.sendEmail({
      email: userMail.email,
      subject: "Password Reset",
      message: `<h2>Click this <a href=${req.protocol}://${req.hostname}:${process.env.PORT}/routes/#login>link</a> and log in using the password here: ${userPass}</h2>`,
    });
    return res.json({
      status: res.statusCode,
      message: "Success! Check your email",
    });
  } else {
    return res.json({
      status: res.statusCode,
      message: "Email does not exist",
    });
  }
};
