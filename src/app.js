const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validation = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup',async (req,res)=>{
    

   try{
    // validation of data
    validation.validateSignUpData(req);
    const {firstName,lastName,emailId,password} = req.body

    // encrypt password
    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({
        firstName,lastName,emailId,password: passwordHash
    });


    await user.save();
    return res.send('user added successfully')
   }catch(err){
    console.log(err);
    return res.status(400).send(err.message)
   }
})

app.post('/login',async (req,res)=>{
    

   try{
    const {emailId,password} = req.body;

    const user = await User.findOne({emailId});

    if(!user){
          return res.status(400).send('invalid credentials')

    }

    const isPassword = await bcrypt.compare(password,user.password);

    if(!isPassword){
          return res.status(400).send('invalid credentials');

    }
    return res.send('user logged in successfully')
   }catch(err){
    console.log(err);
    return res.status(400).send(err.message)
   }
})


app.get('/feed,',async (req,res)=>{
   try{
   const users =  await User.find({});
    return res.send(users)
   }catch(err){
    console.log(err);
    return res.status(400).send('something went wrong')
   }
})

app.get('/user',async (req,res)=>{
   try{
   const users =  await User.find({emailId:req.body.emailId});
   if(!users.length){
    return res.status(404).send('user not found')
   }
    return res.send(users)
   }catch(err){
    console.log(err);
    return res.status(400).send('something went wrong')
   }
})
app.delete('/user',async (req,res)=>{
   try{
   const users =  await User.findByIdAndDelete(req.body.userId);
   if(!users.length){
    return res.status(404).send('user not found')
   }
    return res.send(users)
   }catch(err){
    console.log(err);
    return res.status(400).send('something went wrong')
   }
})

app.patch('/user/:userId',async (req,res)=>{
   try{
   const Allowed_Updates = [
    "photoUrl","about","gender","age","skills"
   ]
   
   const isUpdateAllowed = Object.keys(req.body).every(k => Allowed_Updates.includes(k));
   if(!isUpdateAllowed){
    return res.status(404).send('invalid request')
   }
   if(req.body?.skills?.length > 10){
    return res.status(404).send('invalid amount of skills ')
   }
   const users =  await User.findByIdAndUpdate(req.params.userId,req.body,{
    returnDocument:'after',
    runValidators: true
   });
   if(!users){
    return res.status(404).send('user not found')
   }
    return res.send(users)
   }catch(err){
    return res.status(400).send(err.message)
   }
})

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
