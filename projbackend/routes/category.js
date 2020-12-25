const express = require('express');
const router = express.Router();

const {isAdmin, isSignedIn, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, deleteCategory} = require("../controllers/category");

// parameters
router.param( "userId", getUserById );
router.param( "categoryId", getCategoryById );

// routes

// write
router.post( "/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory );

// read
router.get( "/catgory/:categoryId", getCategory );
router.get( "/catgories", getAllCategories );

// update
router.put( "/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory );

// delete
router.delete( "/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory );

module.exports = router;