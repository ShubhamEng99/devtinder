const express = require("express");

const app = express();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/requests");
const userRouter = require('./router/user')


app.use(express.json());
app.use(cookieParser()); // to get cookies back in req and read them


app.use('/',authRouter);
app.use('/profile',profileRouter);
app.use('/request',requestRouter);
app.use('/user',userRouter);



connectDB()
  .then(() => {
    console.log("connected to db");
    app.listen(3000, (err) => {
      console.log("server is running on 3000");
    });
  })
  .catch(() => {
    console.log("error while connecting db");
  });
