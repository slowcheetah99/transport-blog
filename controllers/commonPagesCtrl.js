const Blog = require("../models/blog");

exports.aboutGet = (req, res, next) => {
  res.status(200).render("about");
};

exports.contactGet = (req, res, next) => {
  res.status(200).render("contact");
};

exports.pageNotFoundCtrl = (req, res, next) => {
  res.status(404).render("404");
};

exports.allBlogsCtrl = async (req, res, next) => {
  const allBlogs = await Blog.find({});
  if (!allBlogs) {
    console.log(err.message);
    res.status(302).redirect("/routes");
  } else {
    res.status(200).render("blogs", { blogs: allBlogs });
  }
};
