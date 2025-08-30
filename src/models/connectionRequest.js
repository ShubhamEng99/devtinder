const mongoose = require("mongoose");
const validator = require("validator");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
     toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"

    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:'{VALUE} is not supported'
        },
        required: true
    }
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function (next){
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("cannot send req to yourself");
    
  }
  next(); // to move ahead this is like middleware
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
