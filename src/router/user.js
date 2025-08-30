const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

// get pending requests
router.get("/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    return res.json({
      requests,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// get pending requests
router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      return row.fromUserId;
    });

    return res.json({
      data,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; 
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    let loggedInUser = req.user;
    let connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((element) => {
      hideUsersFromFeed.add(element.fromUserId.toString());
      hideUsersFromFeed.add(element.toUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: Array.from(hideUsersFromFeed),
      },
    }).select("firstName lastName").skip(skip).limit(limit);
    res.send(users);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
