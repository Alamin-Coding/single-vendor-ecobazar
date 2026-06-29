const jwt = require("jsonwebtoken");
const secureMiddleware = async (req, res, next) => {
	const token = req.headers.Authorization || req.headers.authorization;
	if (!token) {
		return res.json({
			success: false,
			message: "Token not found!",
		});
	}
	const decode = jwt.decode(token, process.env.ACCESS_TOKEN);
	console.log(decode);
	if (!decode) {
		return res.json({
			success: false,
			message: "Invalid Token",
		});
	}
	if (decode.role !== "admin") {
		return res.json({
			success: false,
			message: "You are not admin, please don't try",
		});
	}
	console.log({
		message: "Secure Middleware call",
		token,
	});
	next();
};

module.exports = secureMiddleware;
