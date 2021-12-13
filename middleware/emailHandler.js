const { options } = require("joi");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
    pool: true,
    rateLimit: true,
    maxConnections: 1,
    maxMessages: 0.5,
  });

  const mailOptions = {
    from: "Robert Gardner <rokusi15@gmail.com>",
    to: options.email,
    content: "text/html",
    subject: options.subject,
    text: "This is your confirmation message",
    html: options.message,
    //sending attachments
    /*attachments:  [{
      path: "",
    }]*/
  };
  await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
    }
    done();
  });
};
