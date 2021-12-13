const request = require("request");
const dotenv = require("dotenv").config();
const blogSubs = require("../models/commuters");

//newsletter subscription
exports.subCtrl = async (req, res, next) => {
  const blogUser = new blogSubs({
    email: req.body.email,
    selectSub: req.body.selectSub,
  });

  const user = await blogSubs.find({ email: blogUser.email });
  if (Object.entries(user).length !== 0) {
    return res
      .status(400)
      .json({ status: res.statusCode, message: "Email already registered!" });
  }

  await blogUser.save();
  const mcSubData = {
    members: [
      {
        email_address: blogUser.email,
        tags: [blogUser.selectSub],
        status: "subscribed",
      },
    ],
  };

  const mcSubDataPost = JSON.stringify(mcSubData);

  const options = {
    url: `${process.env.MAILCHIMP_API_EMAIL_TRIGGER_ENDPOINT}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //change to the .env variable later on
      Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
    },
    body: mcSubDataPost,
  };

  if (blogUser.email) {
    request(options, (err, response, body) => {
      // console.log(response.body);
      if (err) {
        console.log(err);
        return res
          .status(402)
          .json({ status: response.statusCode, error: err.message });
      } else {
        return res
          .status(200)
          .json({ status: response.statusCode, message: "Subscribed!" });
      }
    });
  } else {
    return res
      .status(404)
      .json({ status: response.statusCode, message: "Failed! Try again" });
  }
};
