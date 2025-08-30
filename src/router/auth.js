const express = require("express");
const User = require("../models/user");
const validation = require("../utils/validation");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // validation of data
    validation.validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    return res.send("user added successfully");
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("invalid credentials");
    }

    const isPassword = await user.validatePassword(password);

    if (!isPassword) {
      return res.status(400).send("invalid credentials");
    }

    // create token
    const token = await user.getJWT();

    // add token to cookie and send response back to user
    res.cookie("token", token);
    return res.send("user logged in successfully");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logout successfull");
});

module.exports = router;
