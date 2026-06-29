const { Schema, model } = require("mongoose");

const productSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	images: [
		{
			url: {type: String, required: true},
			isMain: Boolean,
			default: false
		}
	]
}, {timestamps: true})

// const User = Model("User", userSchema);

module.exports = model("Product", productSchema);
