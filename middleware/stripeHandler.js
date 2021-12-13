const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const saccoModel = require("../models/sacco");
const Subscription = require("../models/subscription");
//will be run only if membership is premium

exports.stripeProduct = async (user) => {
  const usr = await saccoModel.find({ email: user.email });
  stripe.checkout.session.create({
    payment_methods_types: ["card"],
    success_url: `/routes/${user._id}`,
    cancel_url: "/routes/",
    customer_email: usr.email,
    client_reference_id: user._id,
    line_items: [
      {
        name: "Blog Subscription",
        description: "Premium Subscription for CBD Transport Services",
        images: usr.imageUpload,
        amount: "50",
        currency: "usd",
        quantity: 1,
      },
    ],
  });
};

exports.getConsole = () => {
  console.log("Hello");
};
