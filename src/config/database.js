const mongoose = require('mongoose');

const connectDB = async () =>{
await mongoose.connect('mongodb+srv://shubham:Shubham5701@cluster0.4cacdbq.mongodb.net/devtinder').then(res =>{
  'connected to db'
});
}

module.exports = connectDB;



