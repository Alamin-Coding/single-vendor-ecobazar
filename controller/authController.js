const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, sendForgotEmail } = require("../utils/sendEmail");

const registrationController = async (req, res) => {
	const { email, firstName, password, confirmPassword, acceptTerms } = req.body;
	if (!email || !password || !confirmPassword || acceptTerms === undefined) {
		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}

	if (password !== confirmPassword) {
		return res.status(400).json({
			success: false,
			message: "Passwords do not match",
		});
	}

	if (typeof acceptTerms !== "boolean" || acceptTerms === false) {
		return res.status(400).json({
			success: false,
			message: "You must accept the terms and conditions",
		});
	}

	const isUserExist = await UserModel.findOne({ email });
	if (isUserExist) {
		return res.json({
			success: false,
			message: "User Already exist",
		});
	}

	// hash password create
	const hashPassword = bcrypt.hashSync(password, 10);

	const newUser = await UserModel.create({
		firstName,
		email,
		password: hashPassword,
		acceptTerms,
	});

	const token = jwt.sign(
		{ id: newUser._id, email: newUser.email },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" },
	);

	// send verification email
	sendEmail(email, firstName, token);

	res.json({
		success: true,
		message: "User registration successfull",
		data: {
			email: newUser.email,
			acceptTerms: newUser.acceptTerms,
			role: newUser.role,
		},
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
		const userId = decoded.id;
		console.log("USER ID ", userId);

		const hasUser = await UserModel.findOne({ _id: userId });
		console.log(hasUser);

		if (!hasUser) {
			return res.json({
				success: false,
				message: "User not found",
			});
		}
		hasUser.isVerified = true;
		hasUser.save();
	});

	res.json({
		success: true,
		message: "email varification successfull",
	});
};
const loginController = async (req, res) => {
	const { email, password } = req.body;

	const isUserExist = await UserModel.findOne({ email });

	if (!isUserExist) {
		return res.json({
			success: false,
			message: "User Not Found!",
		});
	}

	// Password match
	const matchPassword = bcrypt.compareSync(password, isUserExist.password);

	if (!matchPassword) {
		return res.json({
			success: false,
			message: "Credential error",
		});
	}

	const token = jwt.sign(
		{ id: isUserExist._id, email: isUserExist.email, role: isUserExist.role },
		process.env.ACCESS_TOKEN,
		{ expiresIn: "7d" },
	);

	res.json({
		success: true,
		message: "Successfully Login",
		accesstoken: token
	});
};
const forgotPasswordController = async (req, res) => {
	const { email } = req.body;

	const isUserExist = await UserModel.findOne({ email });

	if (!isUserExist) {
		return res.json({
			success: false,
			message: "User Not Found!",
		});
	}

	try {
		const token = jwt.sign(
			{ id: isUserExist._id, email: isUserExist.email, role: isUserExist.role },
			process.env.AccessToken,
			{ expiresIn: "10m" },
		);

		sendForgotEmail(email, "Al-amin", token);

		res.json({
			success: true,
			message: "Check your email and set the new password",
		});
	} catch (error) {
		console.log("Server Error", error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
const setNewPasswordController = async (req, res) => {
	const { newPassword, confirmPassword } = req.body;
	const { token } = req.params;

	if (newPassword !== confirmPassword) {
		return res.status(401).json({
			success: false,
			message: "Passwords do not match",
		});
	}

	if (!token) {
		return res.json({
			success: false,
			message: "Token Not Found!",
		});
	}

	try {
		const decode = jwt.decode(token, process.env.AccessToken);
		console.log("DECODE", decode);
		const user = await UserModel.findById(decode.id);
		console.log(user);

		// Generate hashpassword
		const hashpassword = bcrypt.hashSync(newPassword, 10);
		user.password = hashpassword;
		await user.save();

		res.json({
			success: true,
			message: "Successfully change the password",
		});
	} catch (error) {
		console.log("Server Error", error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const revarificationController = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}

	try {
		const isUserExist = await UserModel.findOne({ email });
		if (!isUserExist) {
			return res.json({
				success: false,
				message: "User not found!",
			});
		}

		// check the user already verify or not
		if (isUserExist.isVerified) {
			return res.json({
				success: false,
				message: "User already vefified",
			});
		}

		const token = jwt.sign(
			{ id: isUserExist._id, email: isUserExist.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
		);
		// send verification email
		sendEmail(email, isUserExist.email, token);

		return res.json({
			success: true,
			message: "Resend varification email. please check your email",
		});
	} catch (error) {
		return res.json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	registrationController,
	verifyController,
	loginController,
	forgotPasswordController,
	setNewPasswordController,
	revarificationController,
};
