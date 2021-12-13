const Blog = require("./../models/blog");
const saccoModel = require("../models/sacco");
const blogValidation = require("./../models/validation/blogValidation");
const emailTemplate = require("./emailController");
// const blogSubs = require("../models/commuters");
// const request = require("request");
const dotenv = require("dotenv").config();
var url = require("url");
const axios = require("axios");
const emailHandler = require("../middleware/emailHandler");

//token is provided on login to account hence jwt method is irrelevant here
exports.getAllBlogsCtrl = async (req, res, next) => {
  const normalBlogs = await Blog.find({});
  res.status(301).redirect("/", { normalBlogs: normalBlogs });
};
//specific blog
exports.getSpecificBlog = async (req, res, next) => {
  const currBlog = await Blog.findById(req.params.id);
  if (err) {
    res.status(401).send(err.message);
  } else {
    res.status(200).send(currBlog);
  }
};

exports.postBlog = async (req, res, next) => {
  const pathUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}`;

  const { error } = blogValidation.blogPostValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  const blogIdent = await saccoModel.findById({ _id: req.params.id });
  const newBlog = new Blog({
    title: req.body.title,
    description: req.body.description,
    blogs: blogIdent._id,
  });
  await newBlog.save();

  //mailchimp API data retrievals
  const users = [];

  //SACCO responsible for the blog
  const sacco = await saccoModel.findById({ _id: req.params.id });

  axios
    .get("https://us1.api.mailchimp.com/3.0/lists/b77c0cd4e2/members", {
      headers: {
        "Content-Type": "application/json",
        //change to the .env variable later on
        Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
      },
    })
    .then((response) => {
      const audience = response.data.members;
      audience.forEach((mem) => {
        mem.tags.forEach((tag) => {
          let mail = mem.email_address;
          let tags = tag.name;

          //keys have to be unique, hence cannot switch the values.
          users[mem.email_address] = tags;
        });
      });

      const values = [];
      const filterObject = () => {
        for (let i = 0; i < Object.values(users).length; i++) {
          if (Object.values(users)[i] === sacco.name) {
            values.push(Object.keys(users)[i]);
          }
        }
      };
      filterObject();
      console.log(values);

      values.forEach((value) => {
        emailHandler.sendEmail({
          email: value,
          subject: "Weekly Blog",
          message: emailTemplate.emailTemplate(sacco, pathUrl),
        });
      });
      saccoModel
        .findOne({ _id: req.params.id })
        .populate("blogs")
        .exec((err, data) => {
          if (err) {
            handleError(err);
            return res.status(400).json({ message: err.message });
          } else {
            return res.status(200).json({
              user: data._id,
              status: res.statusCode,
              message: "Posted",
            });
          }
        });
    })
    .catch((err) => {
      res.status(402).json({ status: res.statusCode, message: err.message });
    });
};

exports.getSaccoSpecificBlogsCtrl = async (req, res, next) => {
  const reqID = req.params.id;
  const userSpecific = await saccoModel.findById({ _id: reqID });
  if (!userSpecific) {
    console.error(err);
    res.status(302).redirect(`/routes/${reqID}`);
  } else {
    const saccoBlogs = await Blog.find({ blogs: userSpecific._id });
    if (!saccoBlogs) {
      console.error(err.message);
      res.status(302).redirect(`/routes/${reqID}`);
    } else {
      res.status(200).render("blogPosts", {
        userSpecific: userSpecific,
        saccoBlogs: saccoBlogs,
      });
    }
  }
};

exports.getEditBlogCtrl = async (req, res, next) => {
  const firstUrlParam = req.url.slice(1, 25);
  const userUrl = await saccoModel.findById({ _id: firstUrlParam });
  const userSpecific = await Blog.findById({ _id: req.params.id });
  res
    .status(200)
    .render("edit-form.ejs", { userSpecific: userSpecific, userUrl: userUrl });
};
//update
exports.updateBlogCtrl = async (req, res, next) => {
  const currBlog = await Blog.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
    },
    { upsert: true }
  );
  if (!currBlog) console.error(err.message);
  else {
    let saccoID = await saccoModel.findOne({ _id: currBlog.blogs });
    // const redAdr = req.url.slice(1, 25);
    // console.log(req.params.id);
    res.status(301).redirect(`/routes/${saccoID._id}/blog`);
    // res.status(200).json({ user: saccoID._id, status: res.statusCode });
  }
};

//delete
exports.deleteBlogCtrl = async (req, res, next) => {
  const delBlog = await Blog.findByIdAndDelete({ _id: req.params.id });
  if (!delBlog) {
    console.error(err.message);
  } else {
    let redAdr = req.url.slice(1, 25);
    res.status(301).redirect(`/routes/${redAdr}/blog`);
  }
};

// const currUser = blogSubs.find(
//   { selectSub: data.name },
//   (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       let emailIDs = [];
//       data.forEach((el) => {
//         emailIDs.push(el.email);
//       });
//       //find a way to send the emails without re-attaching the headers on the subsequent request
//       for (dataElement of data) {
//         const mcSubData = {
//           email_address: dataElement.email,
//         };
//         const mcSubDataPost = JSON.stringify(mcSubData);
//         const options = {
//           url: process.env.MAILCHIMP_API_EMAIL_TRIGGER_ENDPOINT,
//           method: "POST",
//           body: mcSubDataPost,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
//           },
//         };

//         let currSub = mcSubDataPost;
//         console.log(currSub);
//         if (currSub) {
//           request(options, (err, response, body) => {
//             if (err) {
//               console.log(err);
//               res.status(400).json({ message: err.message });
//             } else {
//               res.status(200).json({ message: "Posted" });
//             }
//           });
//         } else {
//           res.status(404).json({ message: "Failed! Try again" });
//         }
//       }
//     }
//   }
// );
