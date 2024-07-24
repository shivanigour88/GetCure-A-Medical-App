var express = require("express");
const { payment_stripe } = require("../controllers/paymentStripe");
var router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { createOrder } = require("../controllers/order");
const { updateStock } = require("../controllers/product");

const stripe = require("stripe")(process.env.STRIPE_SK);
router.param("userId", getUserById);

router.post(
  "/payment/gateway_stripe/:userId",
  isSignedIn,
  isAuthenticated,
  payment_stripe,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
module.exports = router;
