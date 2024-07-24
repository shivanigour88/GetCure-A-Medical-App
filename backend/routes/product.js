const express = require("express");
const router = express.Router();

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all param
router.param("userId", getUserById);
router.param("productId", getProductById);

//all of actual routes
// Create all route
router.post( "/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct );

// Read routes
router.get( "/product/:productId", getProduct);
router.get( "/product/photo/:productId", photo);

// Delete routes
router.delete("/product/:productId/:userId",isSignedIn,
isAuthenticated,
isAdmin,
deleteProduct);

//update route
router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
  );

//Listing route
router.get("/products", getAllProducts);

router.get("/produts/categories", getAllUniqueCategories);

module.exports = router;