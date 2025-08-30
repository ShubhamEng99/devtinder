const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("invalid email");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported",
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "def",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({firstName:1,lastName:1});


userSchema.methods.getJWT = async function () {
  // create token
  const token = await jwt.sign({ _id: this._id }, "secret", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  // create token
  const isPassword = await bcrypt.compare(passwordByUser, this.password);

  return isPassword;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
