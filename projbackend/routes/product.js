const express = require('express');
const router = express.Router();

const {getProduct, allProducts, getProductById, createProduct, photo, updateProduct, deleteProduct, getAllUniqueCategories} = require('../controllers/product');
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');

// parameter extractors
router.param( "productId", getProductById );
router.param( "userId", getUserById );

// read
router.get( "/product/:productId", getProduct );
router.get( "/product/photo/:productId", photo );

// listing
router.get( "/products", allProducts );

// write
router.post( "/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct );

// update
router.put( "/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct );

// delete
router.delete( "/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct );

router.get( "/products/categories", getAllUniqueCategories );

module.exports = router;