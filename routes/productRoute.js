const { Router } = require("express");
const secureMiddleware = require("../middleware/secureMiddleware");
const router = Router();

router.post("/create", secureMiddleware, async (req, res) => {
	const { title } = req.body;

	res.json({
		success: true,
		message: "Product created successfully",
		data: title,
	});
});

module.exports = router;
