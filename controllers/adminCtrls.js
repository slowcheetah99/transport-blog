const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const adminValidation = require("./../models/validation/adminValidation");
const Admin = require("./../models/admin");
const Blog = require("../models/blog");
const saccoModels = require("../models/sacco");
const emailHandler = require("../middleware/emailHandler");

const maxAge = 1 * 24 * 60 * 60;
//middleware for creating the token
const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

exports.getAdminCtrl = async (req, res, next) => {
  const saccosFound = await saccoModels.find({});
  if (!saccosFound) {
    console.error(err.message);
  } else {
    let labels = [];
    let dataSetIDs = [];
    let datasets = [];
    let datasetValues = [];

    saccosFound.forEach((sacco) => {
      labels.push(sacco.name);
      dataSetIDs.push(sacco._id);
    });

    for (const set of dataSetIDs) {
      Blog.find({ blogs: set }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          datasetValues.push(data.length);
        }
      }).select("blogs");
    }

    const adminFound = await Admin.find({});
    //since the admin is one, using find() will result in an undefined error as it is supposed to return an array
    res.status(200).render("admin/home", {
      adminUser: adminFound,
      labels: labels,
      datasetValues: datasetValues,
    });
  }
};

exports.getAdminRegisterCtrl = (req, res, next) => {
  res.status(200).render("admin/index");
};
exports.postAdminRegisterCtrl = async (req, res, next) => {
  //make sure to make the bcrypt functions asynchronous
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const adminUser = new Admin(
    {
      email: req.body.email,
      username: req.body.username,
      password: hashPassword,
      phoneNumber: req.body.phoneNumber,
    },
    (err) => {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
  console.log(req.body);
  const { error } = await adminValidation.registerValidation(req.body);
  //checking for conditions met
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) {
    return res
      .status(400)
      .send("Email already registered under an active user. Try Again");
  }

  const adminCount = await Admin.countDocuments();
  if (adminCount >= 1) {
    return res.status(401).json({ msg: "Only one admin at a time" });
  }

  try {
    let savedUser = await adminUser.save();
    //creating the token
    let verifiedAdmin = jwtToken(savedUser._id);
    //storing the token in a cookie
    res.cookie("jwtCookie", verifiedAdmin, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(302).redirect("/admin/home");
  } catch (err) {
    res.status(302).redirect("/admin");
  }
};
//loginValidation

exports.postAdminLoginCtrl = async (req, res, next) => {
  const { error } = await adminValidation.loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const usr = await Admin.findOne({ username: req.body.username });
  if (!usr) {
    return res.status(400).send("Wrong Username or Password Please Try Again");
  }
  const validPass = await bcrypt.compare(req.body.password, usr.password);
  if (!validPass) {
    return res
      .status(400)
      .send("Wrong Username or Password! Please Try Again!");
  }
  let verifiedAdmin = jwtToken(usr._id);
  //storing the token in a cookie
  res.cookie("jwtCookie", verifiedAdmin, {
    httpOnly: true,
    maxAge: maxAge * 1000,
  });
  res.status(200).json({ status: res.statusCode });
  // res.status(302).redirect("home");
};

//when it comes to redirecting and using ejs, do not pass the object to the next view, it will result in a syntax deprecation error

exports.getAdminLoginCtrl = (req, res, next) => {
  res.status(200).render("admin/login");
};
//delete route omitted as we do not need to delete the admin for any task. Only update the details of the previous and blacklist his/her previous details
//update

exports.updateAdminCtrlGet = async (req, res, next) => {
  const adminFound = await Admin.find({});
  if (!adminFound) {
    console.error(err.message);
  } else {
    res.status(200).render("admin/profile", { adminDetails: adminFound });
  }
};
exports.updateAdminCtrl = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const newDetails = await Admin.findOneAndUpdate(
    { _id: req.params.id },
    { username: req.body.username, password: hashPassword },
    { new: true }
  );
  if (!newDetails) {
    console.error(err);
    res.status(302).redirect("/admin");
  } else {
    res.status(302).redirect("/admin/home");
  }
  return res.status(200).send(newDetails);
};

exports.adminLogout = (req, res, next) => {
  //storing the token in a cookie
  res.cookie("jwtCookie", "", {
    maxAge: 1,
  });
  res.status(302).redirect("/admin/");
};

exports.sendReports = async (req, res, next) => {
  const sentReport = await saccoModels.find({});
  if (!sentReport) {
    console.log(err);
  } else {
    res.render("admin/requests", { saccoData: sentReport });
  }
};

exports.sendReportsPost = async (req, res, next) => {
  const sentReport = await saccoModels.findById({ _id: req.params.id });
  if (!sentReport) {
    console.error(err.message);
  } else {
    emailHandler.sendEmail({
      email: sentReport.email,
      subject: "Weekly Report",
      message: `<h2>Click this <a href=${req.protocol}://${req.hostname}:${process.env.PORT}/routes/requests/${sentReport._id}>Link</a> to generate your weekly report</h2>`,
    });
    try {
      res.status(200).redirect("/admin/home/requests");
    } catch (err) {
      if (err) {
        console.error(err);
        res.status(302).redirect("/admin/home/");
      }
    }
  }
};

exports.reportPreview = async (req, res, next) => {
  const user = await saccoModels.findById({ _id: req.params.id });
  const blogs = await Blog.find({ blogs: user._id });
  const blogNum = blogs.length;
  res.render("admin/report-preview", {
    user,
    blogs,
    blogNum,
  });
};

exports.getAdminLogoutCtrl = (req, res, next) => {
  //storing the token in a cookie
  res.cookie("cookieJwt", "", {
    maxAge: 1,
  });
  res.status(302).redirect("/admin/");
};
