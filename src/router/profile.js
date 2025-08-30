const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const validation = require("../utils/validation");
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("something went wrong");
  }
});

// router.delete("/delete",userAuth, async (req, res) => {
//   try {
//     const users = await User.findByIdAndDelete(req.body.userId);
//     if (!users.length) {
//       return res.status(404).send("user not found");
//     }
//     return res.send(users);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("something went wrong");
//   }
// });

router.patch("/edit",userAuth, async (req, res) => {
  try {
    
    if (!validation.validateEditProfileData(req)) {
      return res.status(404).send("invalid request");
    }
    if (req.body?.skills?.length > 10) {
      return res.status(404).send("invalid amount of skills ");
    }
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!users) {
      return res.status(404).send("user not found");
    }
    return res.send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});


router.patch("/forgotPassword", async (req, res) => {
  try {
    if(!validator.isStrongPassword(req.body.password)){
        throw new Error("Password is not strong enough");
    }
    const user = await User.find({emailId: req.body.emailId});
    if (!user) {
      return res.status(404).send("user not found");
    }
    let password = await bcrypt.hash(req.body.password);
    user.password = password;
    await user.save()
    return res.send(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
