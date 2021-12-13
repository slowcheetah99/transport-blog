//const Auth = require('../2FA_auth/auth');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.authJwt = (req, res, next) => {
  const token = req.cookies.jwtCookie;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(302).redirect("/admin");
  }
};

exports.jwtAuth = (req, res, next) => {
  const tokenSecret = req.cookies.cookieJwt;

  if (tokenSecret) {
    jwt.verify(tokenSecret, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/404");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(302).redirect("/404");
  }
};

exports.emailAuth = (req, res, next) => {
  const emailToken = req.cookies.emailJwt;

  if (emailToken) {
    jwt.verify(
      emailToken,
      process.env.PASS_CONFIRM_TOKEN,
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.status(302).redirect("/routes/404");
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    res.status(302).redirect("/404");
  }
};
