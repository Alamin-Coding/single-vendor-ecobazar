const { Schema, Model } = require("mongoose");
const { type } = require("node:os");

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
      minlength: 6,
      maxlength: 32,
    },
    confirmPassword: {
      type: String,
      required: true,
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
    billingAddress: {
      firstName: {
        type: String,
        trim: true,
        required: true,
      },
      lastName: {
        type: String,
        trim: true,
        required: true,
      },
      companyName: {
        type: String,
        trim: true,
      },
      streetAddress: {
        type: String,
        trim: true,
        required: true,
      },
      zipcode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phoneNumber: {
        type: String,
        trim: true,
        required: true,
      },
    },
  },
  { timestamp: true },
);

const User = Model("User", userSchema);

module.exports = User;
