const express = require("express");
const { registrationController, verifyController, loginController, forgotPasswordController } = require("../controller/authController");

const router = express.Router();

router.post("/register", registrationController);
router.post("/verify/:token", verifyController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);


module.exports = router;