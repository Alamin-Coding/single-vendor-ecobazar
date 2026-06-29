const express = require("express");
const {
	registrationController,
	verifyController,
	loginController,
	forgotPasswordController,
	setNewPasswordController,
	revarificationController,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", registrationController);
router.post("/verify/:token", verifyController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/setnew-password/:token", setNewPasswordController);
router.post("/revarify-email", revarificationController);

module.exports = router;
