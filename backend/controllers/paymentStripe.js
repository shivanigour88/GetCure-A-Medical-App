const { Order, ProductCart } = require("../models/order");
const Product = require("../models/product");

// Import the Stripe library and pass in the secret key
const stripe = require("stripe")(process.env.STRIPE_SK);

// Import the uuid library to generate unique idempotency keys
const uuid = require("uuid/v4");

const product = require("../models/product");
const { json } = require("body-parser");

// Function to handle the payment using Stripe
exports.payment_stripe = (req, res, next) => {
  // Destructure the products and token from the request body
  const { products, token } = req.body;

  // Generate a unique idempotency key
  const idempontencyKey = uuid();

  // Iterate over the products and verify that the price has not been tampered with
  products.map((product) => {
    let nam = product.name;
    Product.findById(product._id).exec((err, prod) => {
      if (err) {
        // If the product cannot be found, return an error message
        return res.status(400).json({
          error: `${nam} not Found`,
        });
      }
      if (prod.price != product.price) {
        // If the price has been tampered with, return an error message
        res.status(400).json({ error: "Amount was tempered" });
      }
    });
  });

  // Create a new customer in Stripe using the token provided in the request body
  stripe.customers
    .create({
      email: token.email,
    })
    .then((customer) => {
      // Add the order information to the request body
      req.body.order = {
        products: req.body.products,
        transaction_id: req.body.token.id,
        amount: req.body.amount,
        user: req.body.user._id,
      };
      
      // Log the order information
      console.log("ORDER:", req.body.order);

      // Call the next middleware
      next();
    })
    .catch((error) => console.error(error));
};
