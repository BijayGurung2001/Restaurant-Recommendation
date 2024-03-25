const express=require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const router = require('./src/router/routes');

const app=express();
app.use(bodyParser.json());
app.use(cors())

app.use('/', router)
app.use('/user/signup', router)
app.use('/user/login', router)
app.use('/restaurant/signup', router)
app.use('/restaurant/login', router)

app.listen('999',()=>{
    console.log('server is running at : 999')
})