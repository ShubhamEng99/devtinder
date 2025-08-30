const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    if (!["interested", "ignores"].includes(status)) {
      throw new Error("invalid status");
    }
    let validToUser = await User.findById(toUserId);
    if(!validToUser){
      return res.status(404).json({
        message:"user not found"
      });
    }
    let existingReq = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingReq) {
     return res.status(404).json({
        message:"req already exists"
      });
    }
    let connection = new ConnectionRequest({ fromUserId, toUserId, status });
    const data = await connection.save();
    return res.json({
      message: req.user.firstName + status + "in" + validToUser.firstName,
      data,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/review/:status/:requestId",userAuth,async (req,res)=>{
  try {
    const requestId = req.params.requestId;
    const status = req.params.status;
    if (!["accepted", "rejected"].includes(status)) {
      throw new Error("invalid status");
    }
    let request = await ConnectionRequest.findOne({_id:requestId,toUserId: req.user._id,status:"interested"});
    if(!request){
      return res.status(404).json({
        message:"request not found"
      });
    }
    request.status = status;
    let data = await request.save();

    return res.json({
      message: "request " + status,
      data,
    });

  } catch (error) {
    return res.status(400).send(error.message)
  }
})

module.exports = router;
