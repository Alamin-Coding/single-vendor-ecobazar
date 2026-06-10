const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const registrationController = async (req, res) => {
	const { email, username, password, confirmPassword, acceptTerms } = req.body;
	if (!email || !password || !confirmPassword || acceptTerms === undefined) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	if (password !== confirmPassword) {
		return res.status(400).json({
			message: "Passwords do not match",
		});
	}

	if (typeof acceptTerms !== "boolean" || acceptTerms === false) {
		return res.status(400).json({
			message: "You must accept the terms and conditions",
		});
	}

	const isUserExist = await UserModel.findOne({ email });

	// hash password create
	const hashPassword = bcrypt.hashSync(password, 10);

	if (!isUserExist) {
		const newUser = await UserModel.insertOne({
			email,
			password: hashPassword,
			acceptTerms,
		});
		newUser.save();

		const token = jwt.sign(
			{ id: newUser._id, email: newUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
		);

		// send verification email
		sendEmail(email, username, token);
	}

	res.json({
		message: "User registration successful",
		data: req.body,
	});
};

const verifyController = async (req, res) => {
	const { token } = req.params;

	// token check
	jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
		// err
		if (err) {
			return res.json({
				success: false,
				message: "invalid token",
			});
		}
		// decoded token
        const userId = decoded.id
        console.log("USER ID ", userId)

        const hasUser = await UserModel.findOne({_id:userId})
        console.log(hasUser)

        if (!hasUser) {
			return res.json({
				success: false,
				message: "User not found",
			});
		}
        hasUser.isVerified=true;
        hasUser.save();
	});


	res.json({ 
        success: true,
        message: "email varification successfull"
     });
};
const loginController = (req, res) => {
	res.json({});
};

module.exports = { registrationController, verifyController, loginController };
