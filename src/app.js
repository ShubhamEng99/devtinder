const express = require('express');

const app = express();

app.use(express.json())

app.get('/',(req,res)=>{
    return res.end('res')
})

app.listen(3000,(err)=>{
    console.log('server is running on 3000')
})