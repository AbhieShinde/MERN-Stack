var express = require("express");
var router = express.Router();

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require('express-validator');

router.post("/signup", [
    check("name").isLength({ min: 3 }).withMessage('Name must be at least 3 chars long'),
    check("email", "Email is requried").not().isEmpty().isEmail().withMessage('Enter valid Email'),
    check("password", "Password should at lease 5 chars long").not().isEmpty().isLength({ min: 5 })
], signup);

router.post("/signin", [
    check("email", "Email is requried").not().isEmpty().isEmail().withMessage('Enter valid Email'),
    check("password", "Password should at lease 5 chars long").not().isEmpty().isLength({ min: 5 })
], signin);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
    res.send( req.auth );
});

module.exports = router;
