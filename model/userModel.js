const { Schema, model } = require("mongoose");

const billingAddressSchema = new Schema(
	{
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		companyName: {
			type: String,
			trim: true,
		},
		streetAddress: {
			type: String,
			trim: true,
		},
		zipcode: {
			type: String,
			trim: true,
		},
		country: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
		},
	},
	{ _id: false },
);

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		confirmPassword: {
			type: String,
			trim: true,
		},
		acceptTerms: {
			type: Boolean,
			required: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		avatar: {
			type: String,
			trim: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
		role: {
			type: String,
			enum: ["user", "admin", "editor"],
			default: "user",
		},
		//
		billingAddress: billingAddressSchema,
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamp: true },
);

// const User = Model("User", userSchema);

module.exports = model("User", userSchema);
