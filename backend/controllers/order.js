const { Order, ProductCart } = require("../models/order");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// This function is used to get the order details by ID
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      // If there's an error, return an error message
      if (err) {
        return res.status(400).json({
          error: "No order found in DB",
        });
      }
      // Add the order to the request object
      req.order = order;
      // Continue to the next middleware
      next();
    });
};

// This function is used to create an order
exports.createOrder = (req, res) => {
  // Add the user ID to the order
  req.body.order.user = req.profile;
  // Create a new order object from the request body
  const order = new Order(req.body.order);
  // Save the order to the database
  order.save((err, order) => {
    // If there's an error, return an error message
    if (err) {
      return res.json({
        error: "Failed to save your order in DB",
      });
    }
    // Return the saved order
    return res.status(200).json(order);
  });
};

// This function is used to upload a prescription for an order
exports.prescription = (req, res) => {
  let order = req.order;
  console.log("hello"+order);
  // Create a new formidable form
  let form = new formidable.IncomingForm();
  // Keep the file extensions
  form.keepExtensions = true;
  // Parse the incoming form data
  form.parse(req, (err, fields, file) => {
    // If there's an error, return an error message
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }

    // Handle the uploaded file
    if (file.photo) {
      // Check if the file size is too big
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File Size too BIG!",
        });
      }
      // Add the file data and content type to the order
      order.prescription.data = fs.readFileSync(file.photo.path);
      order.prescription.contentType = file.photo.type;
    }

    // Save the updated order to the database
    order.save((err, order) => {
      // If there's an error, return an error message
      if (err) {
        res.status(400).json({
          error: "Saving prescription in DB failed",
        });
      }
      // Return the saved order
      res.json(order);
    });
  });
};

// This function is used to get all orders
exports.getAllOrders = (req, res) => {
  Order.find()
  .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json(order);
    });
};

// exports the function that returns the possible values of the order status
exports.getOrderStatus = (req, res) => {
  // sends a JSON response with the possible values of the order status
  res.json(Order.schema.path("status").enumValues);
};

// exports the function that updates the order status
exports.updateStatus = (req, res) => {
  // updates the order status based on the order ID passed in the request body
  Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        // returns a JSON error response if there is an error updating the order status
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      // returns a JSON response with the updated order
      return res.json(order);
    }
  );
};

// exports the function that retrieves the prescription photo for an order
exports.prescriptionphoto = (req, res, next) => {
  // checks if the prescription photo data exists for the order
  if (req.order.prescription.data) {
    // sets the content type for the response as the same as the prescription photo
    res.set("Content-Type", req.order.prescription.contentType);
    // sends the prescription photo data in the response
    return res.send(req.order.prescription.data);
  }
  // calls the next middleware in the chain if the prescription photo data does not exist
  next();
};
