const Category = require("../models/category");

// Get Category by Id
exports.getCategoryById = (req, res, next, id) => {
  // Find Category by id using the Category model
  Category.findById(id).exec((err, cate) => {
    // If there is an error, return a 400 status code and a JSON error message
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    // If there is no error, attach the found category to the request object and move to the next middleware
    req.category = cate;
    next();
  });
};

// Create Category
exports.createCategory = (req, res) => {
  // Create a new Category using the Category model and request body
  const category = new Category(req.body);
  // Save the created Category
  category.save((err, category) => {
    // If there is an error, return a 400 status code and a JSON error message
    if (err) {
      return res.status(400).json({
        error: "NOT able to save category in DB",
      });
    }
    // If there is no error, return the saved Category as a JSON object
    res.json({ category });
  });
};

// Get Category
exports.getCategory = (req, res) => {
  // Return the Category found by the getCategoryById middleware as a JSON object
  return res.json(req.category);
};

// Get All Categories
exports.getAllCategory = (req, res) => {
  // Find all Categories using the Category model
  Category.find().exec((err, categories) => {
    // If there is an error, return a 400 status code and a JSON error message
    if (err) {
      return res.status(400).json({
        error: "NO categories found",
      });
    }
    // If there is no error, return the found categories as a JSON object
    res.json(categories);
  });
};

// Update Category
exports.updateCategory = (req, res) => {
  
  // Get the Category found by the getCategoryById middleware
  const category = req.category;
  // Log the Category and request body for debugging purposes
  console.log(`${category}///${JSON.stringify(req.body)}///${req.body.name}`);

  // Update the name of the Category with the new name from the request body
  category.name = req.body.name;
  // category.name = "sum";

  // Save the updated Category
  category.save((err, updatedCategory) => {
    // If there is an error, return a 400 status code and a JSON error message
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    // If there is no error, return the updated Category as a JSON object
    res.json(updatedCategory);
  });
};

// Remove Category
exports.removeCategory = (req, res) => {
  // Get the Category found by the getCategoryById middleware
  const category = req.category;
  // Remove

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    res.json({
      message: "Successfull deleted",
    });
  });
};
