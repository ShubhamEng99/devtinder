const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
     if(!token){
    return res.status(400).send('invalid token');
   }

    const decodedObj = await jwt.verify(token, "secret");
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = {
  userAuth,
};
