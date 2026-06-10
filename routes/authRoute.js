const express = require("express");
const { registrationController, verifyController } = require("../controller/authController");

const router = express.Router();

router.post("/register", registrationController);
router.get("/verify/:token", verifyController);


module.exports = router;