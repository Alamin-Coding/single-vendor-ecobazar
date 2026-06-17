const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendEmail, sendForgotEmail} = require("../utils/sendEmail");

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
	if(isUserExist) {
		return res.json({
			success: false,
			message: "User Already exist"
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
		data: newUser
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
const loginController = async (req, res) => {
	const {email, password} = req.body;

	const isUserExist = await UserModel.findOne({ email });

	if(!isUserExist) {
		return res.json({
			success: false,
			message: "User Not Found!"
		});
	}

	// Password match
	const matchPassword = bcrypt.compareSync(password, isUserExist.password)
	
		if(!matchPassword) {
			return res.json({
				success: false,
				message: "Credential error"
			});
		}

	res.json({
		success: true,
		message: "Successfully Login"
	});
};
const forgotPasswordController = async (req, res) => {
	const {email} = req.body;

	const isUserExist = await UserModel.findOne({ email });

	if(!isUserExist) {
		return res.json({
			success: false,
			message: "User Not Found!"
		});
	}

	const token = jwt.sign({}, process.env.JWT_SECRET, {expiresIn: "2m"});

	sendForgotEmail(email, token)

	res.json({
		success: true,
		message: "Check your email"
	});
};



module.exports = { registrationController, verifyController, loginController, forgotPasswordController };
