const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

// Route to generate JWT
router.get("/token", authController.generateToken);
router.get("/meetauth", authController.getAuthGoogleApi);
router.get("/oauthcallback", authController.oauthcallback);

module.exports = router;
